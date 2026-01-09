/* eslint-disable */
import { useEffect, useState, useRef, useMemo } from 'react'
import ReactPaginate from 'react-paginate'
import closeIcon from '../../../assets/close.png'
import { Button } from '../../../components/Button.jsx'
import { Heading } from '../../../components/Heading.jsx'
import ReIDTreeItem from '../../../components/ReIDTreeItem.jsx'
import TreeView from '../../../components/TreeView.jsx'
import classNames from 'classnames'
import { createPortal } from 'react-dom'
import Modal from '../../../components/Modal.jsx'
import styles from './RenameModal.module.css'

import downloadIcon from '../../../assets/download-icon.svg'
import downloadIconOnclick from '../../../assets/download-icon-click.svg'
import "./ReIDView.css"


export default function ImagesView({ detects: initialDetects, label }) {
  const [files, setFiles] = useState([]) // Store the files in the current folder
  const [detects, setDetects] = useState(initialDetects) // Store the folder tree
  const [currentFolder, setCurrentFolder] = useState('') // Store the current folder path
  const currentFiles = useMemo(
    () => files.filter((item) => item.parent === currentFolder),
    [files, currentFolder]
  )
  const [selected, setSelected] = useState(new Set()) // Store the selected file path
  const [preview, setPreview] = useState(null) // Store the current preview image
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteItemId, setDeleteItemId] = useState(null)
  const [showRenameModal, setShowRenameModal] = useState(false)
  const [renameItemId, setRenameItemId] = useState(null)
  const [newID, setNewID] = useState('')
  const [showNotificationModal, setShowNotificationModal] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState('')

  const itemsPerPage = 10
  const [currentPage, setCurrentPage] = useState(0)
  const pageCount = Math.ceil(files.length / itemsPerPage)

  const [inputPage, setInputPage] = useState('1')

  const currentItems = files.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)

  const [hasSelectedFile, setHasSelectedFile] = useState(false);
  useEffect(() => {
  setHasSelectedFile(false);
  }, [currentFolder]);

  const changePage = ({ selected }) => {
    setCurrentPage(selected)
    setInputPage((selected + 1).toString())
    handlePreview(files[selected * itemsPerPage], files)
  }

  useEffect(() => {
    if (!currentFolder) return

    const fetchFiles = async () => {
      setFiles([])

      const selectedFolder = detects.find((item) => item.path === currentFolder)

      if (!selectedFolder.group_id) return

      try {
        const response = await window.api.browseReidImage(
          selectedFolder.date,
          selectedFolder.time,
          selectedFolder.group_id
        )
        const files = response.files
          .filter((item) => !item.isDirectory)
          .map((item) => ({
            ...item,
            parent: selectedFolder.path,
            path: `${selectedFolder.date}/${item.path}`
          }))

        const uniqueFiles = []
        files.forEach((item) => {
          if (uniqueFiles.find((f) => f.name === item.name)) return
          uniqueFiles.push(item)
        })

        if (uniqueFiles.length != 0) {
          handlePreview(uniqueFiles[0], uniqueFiles)
        }

        setFiles(uniqueFiles)
      } catch (error) {
        console.error('Error fetching files:', error)
      }
    }

    fetchFiles()
  }, [currentFolder, detects])

  const handlePreview = async (file, files) => {
    const response = await window.api.viewDetectImage(file.realDate, file.realPath)
    const blob = new Blob([response.data], { type: 'application/octet-stream' })
    setPreview({
      path: file.path,
      name: file.name,
      src: URL.createObjectURL(blob),
      index: files.indexOf(file)
    })

    setPreview({
      path: file.path,
      name: file.name,
      src: URL.createObjectURL(blob),
      index: files.indexOf(file)
    })
    setHasSelectedFile(true)
  }

  const onDelete = (itemId) => {
    console.log('Delete button clicked, itemId:', itemId)
    setDeleteItemId(itemId)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = async (itemId) => {
    console.log('handleConfirmDelete called, itemId:', itemId)
    const [date, time] = itemId.split('/')

    try {
      const response = await window.api.deleteReidResult(date, time)
      if (response.ok) {
        // Show a success notification modal after deletion
        setNotificationMessage(`Successfully deleted the record for date ${date} and time ${time}.`)
        setShowNotificationModal(true)

        // Update the file list by removing the deleted item
        setDetects((prevFiles) => {
          console.log('Before filter:', prevFiles)

          // Delete the item and its children
          const updatedFiles = prevFiles.filter((file) => {
            return !file.path.startsWith(itemId)
          })

          // Check if the parent path has other children
          const parentPath = itemId.substring(0, itemId.lastIndexOf('/'))
          const hasOtherChildren = updatedFiles.some((file) =>
            file.path.startsWith(`${parentPath}/`)
          )

          // Remove the parent path if it has no other children
          const finalFiles = hasOtherChildren
            ? updatedFiles
            : updatedFiles.filter((file) => file.path !== parentPath)

          console.log('After filter:', finalFiles)
          return finalFiles
        })

        setShowDeleteModal(false)
      } else {
        setNotificationMessage(`Failed to delete: ${response.error}`)
        setShowNotificationModal(true)
      }
    } catch (error) {
      console.error('Failed to delete file:', error)
      setNotificationMessage('Failed to delete the file. Please try again.')
      setShowNotificationModal(true)
    }
  }

  const onRename = (itemId, currentName) => {
    console.log('Rename button clicked, itemId:', itemId)
    setRenameItemId(itemId)
    setNewID(currentName)
    setShowRenameModal(true)
  }

  const handleConfirmRename = async (itemId) => {
    console.log('handleConfirmRename called, itemId:', itemId)
    const [date, time, oldGroupId] = itemId.split('/')
    if (newID) {
      if (newID === oldGroupId) {
        setNotificationMessage(
          'The new name is the same as the old name. The group name will not change.'
        )
        setShowNotificationModal(true)
        return
      }
      try {
        const response = await window.api.renameReidGroup(date, time, oldGroupId, newID)
        if (response.ok) {
          console.log('Rename successful')
          setDetects((prevDetects) =>
            prevDetects.map((folder) =>
              folder.path === itemId
                ? { ...folder, name: newID, group_id: newID, path: `${date}/${time}/${newID}` }
                : folder
            )
          )
          fetchFiles(newID)
          setShowRenameModal(false)
          setNotificationMessage(`Successfully renamed from "${oldGroupId}" to "${newID}".`)
          setShowNotificationModal(true)
        } else {
          setNotificationMessage(response.message)
          setShowNotificationModal(true)
        }
      } catch (error) {
        console.error('Failed to rename group:', error)
        setNotificationMessage('Failed to rename the group. Please try again.')
        setShowNotificationModal(true)
      }
    }
  }

  const fetchFiles = async (currentGroupId) => {
    setFiles([])

    const selectedFolder = detects.find((item) => item.group_id === currentGroupId)

    if (!selectedFolder || !selectedFolder.group_id) return

    try {
      const response = await window.api.browseReidImage(
        selectedFolder.date,
        selectedFolder.time,
        selectedFolder.group_id
      )
      if (!response.ok) {
        console.error('Failed to fetch files:', response.error)
        return
      }

      const files = response.files
        .filter((item) => !item.isDirectory)
        .map((item) => ({
          ...item,
          parent: selectedFolder.path,
          path: `${selectedFolder.date}/${item.path}`
        }))

      const uniqueFiles = []
      files.forEach((item) => {
        if (uniqueFiles.find((f) => f.name === item.name)) return
        uniqueFiles.push(item)
      })

      setFiles(uniqueFiles)
    } catch (error) {
      console.error('Error fetching files:', error)
    }
  }

  const handleCloseModal = () => {
    // 将状态 `showDeleteModal` 设置为 false，触发淡出动画
    setShowDeleteModal(false)

    // 设置一个延迟，以等待动画完成后再移除模态框
    setTimeout(() => {
      // 动画完成后，可以执行其他清理操作，例如重置状态等
    }, 500) // 500ms 与 CSS 中的 transition 时间一致
  }

  const onDownload = async (itemId) => {
    const [date, time] = itemId.split('/')

    try {
      const response = await window.api.downloadReidImages(date, time)
      if (!response.ok) {
        throw new Error(response.error)
      }
    } catch (error) {
      console.error('Failed to download result:', error)
      setNotificationMessage('Failed to download the result. Please try again.')
      setShowNotificationModal(true)
    }
  }

  const handleSelectAll = async () => {
    const response = await window.api.getDetectImagePaths(
      currentFolder,
      label,
      parseFloat(confLow),
      parseFloat(confHigh)
    )
    if (response.ok) {
      const newSelected = new Set(selected)
      response.selectAllPaths.forEach((item) => {
        newSelected.add(item.replaceAll('\\', '/'))
      })
      setSelected(newSelected)
    }
  }

  const handleDeselectAll = async () => {
    const response = await window.api.getDetectImagePaths(
      currentFolder,
      label,
      parseFloat(confLow),
      parseFloat(confHigh)
    )
    if (response.ok) {
      const newSelected = new Set(selected)
      response.selectAllPaths.forEach((item) => {
        newSelected.delete(item.replaceAll('\\', '/'))
      })
      setSelected(newSelected)
    }
  }

  const handleDownload = async () => {
      try {
        const selectedPaths = Array.from(selected)
        const response = await window.api.downloadSelectedDetectImages(selectedPaths)
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
      const response = await window.api.runReid(selectedPaths)
      if (!response.ok) {
        setStatus('')
        throw new Error('reid failed: ' + response.error)
      }
      setTimeout(() => navigate('/reid'), 1000)
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

  async function selectInputs() {
    // get all paths with current folder
    const response = await window.api.getDetectImagePaths(
      currentFolder,
      label,
      parseFloat(confLow),
      parseFloat(confHigh)
    )
    // check if all paths are in current selections
    if (response.ok) {
      if (response.selectAllPaths.every((file) => selected.has(file.replaceAll('\\', '/')))) {
        return true
      } else {
        return false
      }
    }
  }

  return (
    
    <div className="ReIDBody"> 
          {/*File nav bar*/}
          <div className="uploads-folder-list"> {/*file navagator*/}
            <TreeView
              onSelectedChange={(itemId) => {
                setCurrentFolder(itemId)
                setPreview(null)
              }}
            >
              <TreeList
                folders={detects}
                level={1}
                onDelete={onDelete}
                onRename={onRename}
                onDownload={onDownload}
              />
            </TreeView>
          </div>


          <div className='uploads-middle-section'>

      {/* Only show header + footer if a folder is selected and has files */}
      {hasSelectedFile && (
        <>
          {/* Header */}
          <div className="uploads__list__item uploads__list__item_title uploads__list__header">
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
              </div>
            </div>
          </div>
        </>
      )}

      {/* Middle / File List */}
        <div className="uploads-file-list">
          {(!currentFolder || !hasSelectedFile) ? (
            <div className="uploads-file-list-warning">
              You can check your detected images here. <br />
              Please select a FILE from the folder tree. <br />
            </div>
          ) : (
            <PaginateItems
              itemsPerPage={itemsPerPage}
              files={currentFiles}
              selected={selected}
              setSelected={setSelected}
              handleAnalyse={handleAnalyse}
              handleDownload={handleDownload}
              preview={preview}
              handlePreview={handlePreview}
              handleSelectAll={handleSelectAll}
              handleDeselectAll={handleDeselectAll}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              pageCount={pageCount}
              currentItems={currentItems}
              changePage={changePage}
              inputPage={inputPage}
              setInputPage={setInputPage}
              setPreview={setPreview}
              selectInputs={selectInputs}
              label={label}
            />
          )}
        </div>

      {/* Footer */}
      {hasSelectedFile && (
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
            <ReactPaginate
              previousLabel={'<'}
              nextLabel={'>'}
              breakLabel={'...'}
              forcePage={currentPage}
              pageCount={pageCount}
              marginPagesDisplayed={1}
              pageRangeDisplayed={5}
              onPageChange={changePage}
              containerClassName="paginationBttns"
              pageLinkClassName="page-num"
              previousLinkClassName="page-num"
              nextLinkClassName="page-num"
              activeLinkClassName="active"
            />
          </ul>

          <div className="btn-2" style={{ width: '200px' }}></div>
        </div>
      )}
    </div>





      {/*doing nothing?*/}
      {showDeleteModal &&
        createPortal(
          <Modal
            className="notification-modal"
            show={showDeleteModal}
            onCloseClick={() => handleCloseModal()}
          >
            <div className={styles.renameModalForm}>
              <p>Are you sure you want to delete this record? </p>
              <p>This action is irreversible and cannot be undone! </p>
              <Button
                className={styles.renameSubmitButton}
                onClick={() => handleConfirmDelete(deleteItemId)}
              >
                Confirm
              </Button>
              <Button className={styles.renameSubmitButton} onClick={() => handleCloseModal()}>
                Cancel
              </Button>
            </div>
          </Modal>,
          document.body
        )}
      {/*doing nothing?*/}
      {showRenameModal &&
        createPortal(
          <Modal
            className="notification-modal"
            show={showRenameModal}
            onCloseClick={() => setShowRenameModal(false)}
          >
            <div className={styles.renameModalForm}>
              <p>Enter the new ID for the group:</p>
              <input
                value={newID}
                onChange={(e) => setNewID(e.target.value)}
                className={styles.renameInput}
              />
              <Button
                className={styles.renameSubmitButton}
                onClick={() => {
                  console.log('Rename confirmed, itemId:', renameItemId)
                  handleConfirmRename(renameItemId)
                }}
              >
                Rename
              </Button>
              <Button
                className={styles.renameSubmitButton}
                onClick={() => setShowRenameModal(false)}
              >
                Cancel
              </Button>
            </div>
          </Modal>,
          document.body
        )}
      {/*doing nothing?*/}
      {showNotificationModal &&
        createPortal(
          <Modal
            className="uploader-modal"
            onCloseClick={() => {
              setShowNotificationModal(false)
              // window.location.reload();
            }}
          >
            <div className={styles.renameModalForm}>
              <p>{notificationMessage}</p>
              <Button
                className={styles.renameSubmitButton}
                onClick={() => {
                  setShowNotificationModal(false)
                  // window.location.reload(); // Reload the page after the notification modal is closed
                }}
              >
                OK
              </Button>
            </div>
          </Modal>,
          document.body
        )}
    </div>
  )
}

function TreeList({ folders, parent = '', level = 1, onDelete, onRename, onDownload }) {
  const list = folders.filter((item) => item.parent === (parent === '' ? parent : parent + '/'))

  return list.map((item) => (
    <ReIDTreeItem
      key={item.path}
      itemId={item.path}
      label={item.name}
      level={level}
      onDelete={onDelete}
      onRename={onRename}
      onDownload={onDownload}
    >
      {folders.find((subItem) => subItem.parent === item.path + '/') && (
        <TreeList
          folders={folders}
          parent={item.path}
          level={level + 1}
          onDelete={onDelete}
          onRename={onRename}
          onDownload={onDownload}
        />
      )}
    </ReIDTreeItem>
  ))
}

function PaginateItems({
  itemsPerPage,
  files,
  selected,
  setSelected,
  handleAnalyse,
  preview,
  handlePreview,
  handleSelectAll,
  handleDeselectAll,
  currentPage,
  setCurrentPage,
  pageCount,
  currentItems,
  changePage,
  inputPage,
  setInputPage,
  setPreview,
  handleDownload,
  selectInputs,
  label
}) {
  const [allSelected, setAllSelected] = useState(null)

  useEffect(() => {
    const getResult = async () => {
      const result = await selectInputs()
      setAllSelected(result)
    }

    getResult()
  })

  const handleInputPageChange = () => {
    const page = +inputPage
    if (Number.isNaN(page)) {
      setInputPage('')
      return
    }

    if (page <= 0) {
      setCurrentPage(0)
      setInputPage('1')
    } else if (page > pageCount) {
      setCurrentPage(pageCount - 1)
      setInputPage(pageCount.toString())
    } else {
      setCurrentPage(page - 1)
      setInputPage(page.toString())
    }

    handlePreview(files[(page - 1) * itemsPerPage], files)
  }

  useEffect(() => {
    setCurrentPage(0)
    setInputPage('1')
  }, [files])

  if (currentItems.length === 0) {
    return (
      <>
      </>
    )
  }

  return (
    <>
      <FileItem
        files={files}
        currentItems={currentItems}
        selected={selected}
        setSelected={setSelected}
        preview={preview}
        handlePreview={handlePreview}
        handleSelectAll={handleSelectAll}
        handleDeselectAll={handleDeselectAll}
        allSelected={allSelected}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        changePage={changePage}
        inputPage={inputPage}
        setInputPage={setInputPage}
        setPreview={setPreview}
        onDownload={handleDownload}
      />
    </>
  )
}

function Preview({
  files,
  preview,
  handlePreview,
  setPreview,
  itemsPerPage,
  currentPage,
  setCurrentPage,
  changePage,
  inputPage,
  setInputPage,
  selected,
  setSelected,
  onDownload
}) {
  const curindex = preview.index
  const curindexmod = curindex % itemsPerPage
  const curPage = Math.floor(curindex / itemsPerPage) + 1

  // Function to navigate to the previous file
  const handlePrev = () => {
    setInputPage(curPage.toString())

    if (curPage != currentPage + 1) {
      setCurrentPage(curPage - 1)
    }

    if (files.length === 0) return

    const prevIndex = curindex > 0 ? curindex - 1 : 0

    if (curindexmod == 0 && prevIndex != 0) {
      setCurrentPage(currentPage - 1)
    }

    handlePreview(files[prevIndex], files)
  }

  // Function to navigate to the next file
  const handleNext = () => {
    setInputPage(curPage.toString())

    if (curPage != currentPage + 1) {
      setInputPage(curPage.toString())
      setCurrentPage(curPage - 1)
    }

    if (files.length === 0) return

    const nextIndex = curindex < files.length - 1 ? curindex + 1 : files.length - 1

    if (curindexmod == itemsPerPage - 1 && nextIndex != files.length - 1) {
      setCurrentPage(currentPage + 1)
    }

    handlePreview(files[nextIndex], files)
  }

  const closePrev = () => {
    setPreview(null)
  }

  return (
    <div className="uploads-preview">
      <div className="preview-header">
        <button
          className="download_button"
          onClick={(e) => {
            e.stopPropagation()
            onDownload(preview)
          }}
        >
          <img src={downloadIcon} alt="Download" className={'downloadIcon'} />
          <img
            src={downloadIconOnclick}
            alt="Download"
            className={'downloadIcon downloadIconHover'}
          />
        </button>
        <Button className="uploads-preview__close-button button--primary" onClick={closePrev}>
          <img alt="Close preview" className="uploads-preview__close-icon" src={closeIcon} />
        </Button>
      </div>
      <img src={preview.src} className="primary-preview" />
      <div className="preview-navigation">
        <label class="checkbox_container_preview">
          <input
            type="checkbox"
            checked={selected.has(preview.path)}
            onChange={(event) => {
              setSelected((selected) => {
                const newSelected = new Set(selected)
                if (event.target.checked) {
                  newSelected.add(preview.path)
                } else {
                  newSelected.delete(preview.path)
                }
                return newSelected
              })
            }}
          ></input>
          <span class="checkmark_preview"></span>
        </label>
        <div>
          <Button
            className="button--primary prev-arrows"
            onClick={handlePrev}
            disabled={files.length <= 1}
          >
            Prev
          </Button>
          <Button
            className="button--primary prev-arrows"
            onClick={handleNext}
            disabled={files.length <= 1}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

function FileItem({
  files,
  currentItems,
  selected,
  setSelected,
  preview,
  handlePreview,
  handleSelectAll,
  handleDeselectAll,
  allSelected,
  itemsPerPage,
  currentPage,
  setCurrentPage,
  changePage,
  inputPage,
  setInputPage,
  setPreview,
  onDownload
}) {
  const selectAllRef = useRef()

  useEffect(() => {
    if (selectAllRef.current) {
      const totalFiles = files.length
      const selectedFilesCount = files.filter((file) => selected.has(file.path)).length
      selectAllRef.current.indeterminate =
        selectedFilesCount > 0 && selectedFilesCount < totalFiles
    }
  }, [files, selected])

  if (currentItems.length === 0) {
    return (
      <div className="uploads__list__item uploads__list__item_title uploads__list__header">
        <div className="uploads__list__item__fileinfo">
          {selected.size > 0 ? selected.size + ' ' : 'No '}
          files found
          <div className="heading-buttons-container">
            {allSelected ? (
              <Button className="heading-buttons button--primary" onClick={handleDeselectAll}>
                Deselect all with subfolders
              </Button>
            ) : (
              <Button className="heading-buttons button--primary" onClick={handleSelectAll}>
                Select all with subfolders
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="file_list_and_preview" style={{ display: 'flex'}}>
        <ul className="uploads__list__items">
          {currentItems.map((file, index) => (
            <li
              className={classNames(
                'uploads__list__item uploads__list__subitem',
                file.path === preview?.path && 'file-name-selected'
              )}
              key={`${file.name}-${index}`}
              onClick={() => handlePreview(file, files)}
            >
              <label class="checkbox_container_list">
                <input
                  type="checkbox"
                  checked={selected.has(file.path)}
                  onChange={(event) => {
                    setSelected((selected) => {
                      const newSelected = new Set(selected)
                      if (event.target.checked) {
                        newSelected.add(file.path)
                      } else {
                        newSelected.delete(file.path)
                      }
                      return newSelected
                    })
                  }}
                ></input>
                <span class="checkmark_list"></span>
              </label>

              <span className="file-name">{file.name}</span>
            </li>
          ))}
        </ul>

        {/* ✅ Render the Preview component below the list */}
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
            onDownload={onDownload}
          />
        )}
      </div>
    </>
  )
}
