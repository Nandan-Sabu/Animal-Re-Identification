import { useEffect, useState, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { add_message, bannerStatuses } from '../../../utils/bannerSlice'
import { Button } from '../../../components/Button'
import { Heading } from '../../../components/Heading'
import Modal from '../../../components/Modal'
import TreeItem from '../../../components/TreeItem'
import TreeView from '../../../components/TreeView'
import Stoat from '@renderer/assets/STOAT.png'
import ReactPaginate from 'react-paginate'
import '../../../components/checkBoxButton.css'


import FileItem from './FileItem'
import Preview from './Preview'

export default function UploadsView({ uploads }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [files, setFiles] = useState([])
  const [currentFolder, setCurrentFolder] = useState('')
  const currentFiles = useMemo(
    () => files.filter((item) => item.parent === currentFolder),
    [files, currentFolder]
  )
  const [selected, setSelected] = useState(new Set())
  const [preview, setPreview] = useState(null)

  const [status, setStatus] = useState('')
  const [completed, setCompleted] = useState(0)
  const [total, setTotal] = useState(0)

  const itemsPerPage = 10
  const [currentPage, setCurrentPage] = useState(0)
  const pageCount = Math.ceil(files.length / itemsPerPage)

  const [inputPage, setInputPage] = useState('1')
  const [allSelected, setAllSelected] = useState(null)
  // const [isSelected, setIsSelected] = useState(false);

  const [currentFolderLabel, setCurrentFolderLabel] = useState('')

  // Code that Allows Warning Message to Show("Please select a FILE from the folder tree.")
  const [hasSelectedFile, setHasSelectedFile] = useState(false);
  useEffect(() => {
  setHasSelectedFile(false);
  }, [currentFolder]);

  useEffect(() => {
    const checkSelection = async () => {
      if (currentFolder) {
        const result = await selectInputs()
        setAllSelected(result)
      }
    }
    checkSelection()
  })

  const currentItems = files.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)

  const changePage = ({ selected }) => {
    setCurrentPage(selected)
    setInputPage((selected + 1).toString())
    handlePreview(files[selected * itemsPerPage], files)
  }

  useEffect(() => {
    if (!currentFolder) return

    const fetchFiles = async () => {
      setFiles([])
      const [date, ...paths] = currentFolder.split('/')
      const response = await window.api.browseImage(date, paths.join('/'))
      if (!response.ok) {
        console.log('browseImage ipc failed')
        return
      }
      const files = response.files
        .filter((item) => !item.isDirectory)
        .map((item) => ({
          ...item,
          parent: currentFolder,
          path: `${date}/${item.path.replaceAll('\\', '/')}`
        }))
      setFiles(files)
      if (files.length != 0) {
        handlePreview(files[0], files)
      }
    }
    fetchFiles()
  }, [currentFolder])

  const handlePreview = async (file, files) => {
    const [date, ...paths] = file.path.split('/')
    const response = await window.api.viewImage(date, paths.join('/'))
    if (!response.ok) {
      console.log('viewImage failed: ' + response.error)
      return
    }
    const blob = new Blob([response.data], { type: 'application/octet-stream' })
    setPreview({
      path: file.path,
      name: file.name,
      src: URL.createObjectURL(blob),
      index: files.indexOf(file)
    })
    setHasSelectedFile(true);
  }

  const handleAnalyse = async () => {
    if (status) return
    const streamListener = (_, text) => {
      const lines = new TextDecoder().decode(text).split('\n')
      for (const line of lines) {
        if (/PROCESS: (\d+)\/(\d+)/.test(line)) {
          setCompleted(+RegExp.$1)
          setTotal(+RegExp.$2)
        }
      }
    }
    try {
      setStatus(statuses.processing)
      window.api.addStreamListener(streamListener)
      const selectedPaths = Array.from(selected)
      const response = await window.api.detect(selectedPaths)
      if (!response.ok) {
        setStatus('')
        throw new Error('detection failed: ' + response.error)
      }
      setTimeout(() => navigate('/images'), 1000)
    } catch (err) {
      setStatus('')
      console.error(err)
      dispatch(
        add_message({
          message: `${err}`,
          status: bannerStatuses.error
        })
      )
    } finally {
      window.api.removeStreamListener(streamListener)
    }
  }

  const handleSelectAll = async () => {
    const response = await window.api.getImagePaths(currentFolder)
    if (response.ok) {
      const newSelected = new Set(selected)
      response.selectAllPaths.forEach((item) => {
        newSelected.add(item.replaceAll('\\', '/'))
      })
      setSelected(newSelected)
    }
  }

  const handleDeselectAll = async () => {
    const response = await window.api.getImagePaths(currentFolder)
    if (response.ok) {
      const newSelected = new Set(selected)
      response.selectAllPaths.forEach((item) => {
        newSelected.delete(item.replaceAll('\\', '/'))
      })
      setSelected(newSelected)
    }
  }

  async function selectInputs() {
    // get all paths with current folder
    const response = await window.api.getImagePaths(currentFolder)
    // check if all paths are in current selections
    if (response.ok) {
      if (response.selectAllPaths.every((file) => selected.has(file.replaceAll('\\', '/')))) {
        return true
      } else {
        return false
      }
    }
  }

  const onDownload = async (file) => {
    const [date, ...paths] = file.path.split('/')

    try {
      const response = await window.api.viewImage(date, paths.join('/'))
      if (!response.ok) {
        const body = response
        throw new Error(body.error)
      }
      const filename = `${file.name}`
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', filename)
      document.body.appendChild(link)
      link.click()
      link.parentNode.removeChild(link)
    } catch (error) {
      console.error('Failed to download result:', error)
      setNotificationMessage('Failed to download the result. Please try again.')
      setShowNotificationModal(true)
    }
  }

  const handleDownload = async () => {
    try {
      const selectedPaths = Array.from(selected)
      const response = await window.api.downloadSelectedGalleryImages(selectedPaths)
      if (!response.ok) {
        throw new Error(response.error)
      }
    } catch (err) {
      console.error(err)
      dispatch(
        add_message({
          message: `${err}`,
          status: bannerStatuses.error
        })
      )
    }
  }

  return (
    <div className="uploads-view">
        <div className="uploads-folder-list">
          <div className="uploads-folder-container">
            <TreeView
              onSelectedChange={async (itemId) => {
                setCurrentFolder(itemId)
                setPreview(null)
              
                // Extract the date from the itemId (first part of the path)
                const datePart = itemId.split('/')[0]

                // Convert YYYYMMDD → "13 August"
                const formattedDate = new Date(
                  datePart.slice(0, 4),             // year
                  parseInt(datePart.slice(4, 6)) - 1, // month (0-indexed)
                  datePart.slice(6, 8)              // day
                ).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })

                setCurrentFolderLabel(formattedDate)
              }}
            >
              <TreeList folders={uploads}></TreeList>
            </TreeView>
          </div>
        </div>
        <div className="uploads-middle-section">
          {preview || hasSelectedFile || currentFolder ? (
          <>
            <div className="uploads__list__item_title uploads__list__header">
              <div className="new_uploads__list__item__fileinfo">

                <div className="left-section">
                  {files.length > 0 && (
                    <label class="checkbox_container_toolbar">
                      <input
                        type="checkbox"
                        checked={currentFiles.length > 0 && currentFiles.every((file) => selected.has(file.path))}
                        ref={el => {
                          if (el) {
                            const totalFiles = currentFiles.length;
                            const selectedFilesCount = currentFiles.filter((file) => selected.has(file.path)).length;
                            el.indeterminate = selectedFilesCount > 0 && selectedFilesCount < totalFiles;
                          }
                        }}
                        onChange={() => {
                          setSelected(prevSelected => {
                            const newSelected = new Set(prevSelected);
                            if (currentFiles.every(file => newSelected.has(file.path))) {
                              currentFiles.forEach(file => newSelected.delete(file.path));
                            } else {
                              currentFiles.forEach(file => newSelected.add(file.path));
                            }
                            return newSelected;
                          });
                        }}
                      />
                      <span class="checkmark_toolbar"></span>
                    </label>
              
                  )}              
                  <span>
                    {files.length > 0 && "Select All | "}
                    {selected.size > 0 ? selected.size + ' ' : 'No '}
                    files found
                  </span>
                </div>

                    
                <div className="heading-buttons-container">
                  {allSelected ? (
                    <Button className="heading-buttons" onClick={handleDeselectAll}>
                      Deselect all with subfolders
                    </Button>
                  ) : (
                    <Button className="heading-buttons" onClick={handleSelectAll}>
                      Select all with subfolders
                    </Button>
                  )}
                </div>
              </div>

            </div>
            <div className="uploads-file-list">
                <FileItem
                  files={files}
                  currentItems={currentItems}
                  selected={selected}
                  setSelected={setSelected}
                  preview={preview}
                  handlePreview={handlePreview}
                />

                {preview && (
                  <Preview
                    files={files}
                    preview={preview}
                    handlePreview={handlePreview}
                    setPreview={setPreview}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    changePage={changePage}
                    inputPage={inputPage}
                    setInputPage={setInputPage}
                    selected={selected}
                    setSelected={setSelected}
                    onDownload={handleDownload}
                  />
                )}
            </div>

            {/* 🔻 BOTTOM TOOLBAR: Pagination + Actions */}
            <div className="tool-bar">
              <Button
                className="button--primary btn-1"
                onClick={handleDownload}
                disabled={selected.size === 0}
              >
                Save Selected
                {selected.size > 0 && <span className="upload-button-count">{selected.size}</span>}
              </Button>
              <ul className="pagination-controls">
                {files.length > 0 && (
                  <ReactPaginate
                    previousLabel={'<'}
                    nextLabel={'>'}
                    breakLabel={'...'}
                    forcePage={currentPage}
                    pageCount={Math.ceil(files.length / itemsPerPage)}
                    marginPagesDisplayed={1}
                    pageRangeDisplayed={5}
                    onPageChange={({ selected }) => setCurrentPage(selected)}
                    containerClassName="paginationBttns"
                    pageLinkClassName="page-num"
                    previousLinkClassName="page-num"
                    nextLinkClassName="page-num"
                    activeLinkClassName="active"
                  />
                )}
              </ul>
              <Button
                className="button--primary btn-2"
                onClick={handleAnalyse}
                disabled={selected.size === 0}
              >
                Run Detection
                {selected.size > 0 && <span className="upload-button-count">{selected.size}</span>}
              </Button>
            </div>
            {status &&
              createPortal(
                <>
                  {/* Mask that blocks interaction outside the modal */}
                  <div className="modal-mask"></div>
                  <Modal
                    className="uploader-modal"
                    onCloseClick={() => {
                      setStatus('') // Clear the status first
                      terminateAIAndRefresh()
                    }}
                  >
                    {generateModalContent(status, completed, total)}
                  </Modal>
                  ,
                </>,
                document.body
              )}

          </>
          ) : (
            <div className="uploads-file-list-warning">
              You can check your added images here. <br />
              Please select a FILE from the folder tree.
            </div>
          )}
        </div>
    </div>
  )
}

const terminateAIAndRefresh = async () => {
  try {
    await window.api.terminateAI()
    // Once the API call is successful, refresh the page
    window.location.reload()
  } catch (error) {
    console.error('Error during AI termination:', error)
  }
}

function TreeList({ folders, parent = '' }) {
  const list = folders.filter((item) => item.parent === (parent === '' ? parent : parent + '/'))

  return list.map((item) => (
    <TreeItem key={item.path} itemId={item.path} label={item.name}>
      {folders.find((subItem) => subItem.parent === item.path + '/') && (
        <TreeList folders={folders} parent={item.path} />
      )}
    </TreeItem>
  ))
}

const statuses = {
  initial: 'Initial',
  uploading: 'Uploading',
  processing: 'Processing',
  error: 'Error',
  success: 'Success',
  done: 'Done'
}

function generateModalContent(status, completed, total) {
  if (status === statuses.uploading) {
    return (
      <>
        <span className="loader"></span>
        <Heading className="modal__heading" level={3}>
          Uploading in progress
        </Heading>
        <p>Images are being uploaded to be processed by the AI model...</p>
      </>
    )
  }

  if (status === statuses.error) {
    return (
      <>
        <Heading className="modal__heading" level={3}>
          There has been an error.
        </Heading>
        <p>Please contact an administrator for assistance.</p>
      </>
    )
  }

  if (status === statuses.processing) {
    return (
      <>
        <span className="loader"></span>
        <Heading className="modal__heading" level={3}>
          Detection in progress...
        </Heading>
        <p>
          The detection AI model is processing your selected images. This is a long-running task.{' '}
          <br />A progress bar will appear if the AI server successfully receives your images.
          Thanks for your patience.
        </p>

        {total > 0 && (
          <div className="progress-container">
            <span>
              {completed} / {total}
            </span>
            <div className="progress-wrapper">
              <progress
                className="progress"
                value={Math.floor((completed / total) * 100)}
                max="100"
              >
                {Math.floor((completed / total) * 100)}%
              </progress>
              <img
                src={Stoat}
                className="progress-icon"
                style={{
                  left: `${Math.floor((completed / total) * 100) - 2}%`
                }}
              />
            </div>
            <span>{Math.floor((completed / total) * 100)}%</span>
          </div>
        )}
      </>
    )
  }
}
