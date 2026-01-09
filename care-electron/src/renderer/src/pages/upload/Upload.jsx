/** @format */
import './upload.css'
import React from 'react'
import clsx from 'clsx'
import black_upload from '../../assets/black_upload.png'
import yellow_upload from '../../assets/yellow_upload.png'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { add_message, bannerStatuses } from '../../utils/bannerSlice'

let width = 1
let once = true

const acceptedFileTypes = ["image/jpeg", "image/png", "image/jpg"]

const statuses = {
  initial: 'Initial',
  uploading: 'Uploading',
  processing: 'Processing',
  error: 'Error',
  success: 'Success',
  done: 'Done'
}

export default function Upload() {
  const [files, setFiles] = React.useState([])
  const [selectedFiles, setSelectedFiles] = React.useState(new Set())
  const [status, setStatus] = React.useState(statuses.initial)
  const [dragging, setDragging] = React.useState(false)
  const [showModal, setShowModal] = React.useState(false)
  const [lastClickedIndex, setLastClickedIndex] = React.useState(null)
  const [searchQuery, setSearchQuery] = React.useState("")

  const [progressLabel, setProgressLabel] = React.useState('Pick files')
  const [progressNumber, setProgressNumber] = React.useState('0/0')
  const [progressWidth, setProgressWidth] = React.useState(0)

  const [loadedFileCount, setLoadedFileCount] = React.useState(0)
  const [currentFolder, setCurrentFolder] = React.useState('')
  const [folders, setFolders] = React.useState([])

  const inputRef = React.useRef(null)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const verifyImage = (file) => {
    if (!acceptedFileTypes.includes(file.type)) {
      if (file.name.toLowerCase().endsWith('.jpg')) return true
      return false
    }
    return true
  }

  const handleDragOver = (e) => {
    e.stopPropagation()
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
    setDragging(true)
  }

  const handleDragLeave = (e) => {
    e.stopPropagation()
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragging(false)
  }

  const handleDrop = async (e) => {
    e.stopPropagation()
    e.preventDefault()
    const filesToAdd = []
    for (let i = 0; i < e.dataTransfer.files.length; i++) {
      const file = e.dataTransfer.files[i]
      if (verifyImage(file)) {
        file._webkitRelativePath = file.webkitRelativePath || file.name
        filesToAdd.push(file)
      } else {
        dispatch(
          add_message({
            message: `Invalid file type: ${file.name}`,
            status: bannerStatuses.error
          })
        )
      }
    }
    setFiles([...files, ...filesToAdd])
    setSelectedFiles(new Set())
    setLastClickedIndex(null)
    setSearchQuery("")
    setDragging(false)
  }

  const handleOnChange = (e) => {
    const filesToAdd = []
    for (let i = 0; i < e.target.files.length; i++) {
      const file = e.target.files[i]
      if (verifyImage(file)) {
        file._webkitRelativePath = file.webkitRelativePath || file.name
        filesToAdd.push(file)
      } else {
        dispatch(
          add_message({
            message: `Invalid file type: ${file.name}`,
            status: bannerStatuses.error
          })
        )
      }
    }
    setFiles(filesToAdd)
    setSelectedFiles(new Set())
    setLastClickedIndex(null)
    setSearchQuery("")
  }

  const handleButtonClick = () => {
    inputRef.current?.click()
  }

  const handleButtonKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === 'Space') {
      e.preventDefault()
      handleButtonClick()
    }
  }

  // Filter files based on search query
  const filteredFiles = files.filter(file =>
    (file._webkitRelativePath || file.webkitRelativePath || file.name).toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Checkbox selection with shift support
  const handleCheckboxClick = (file, idx, event) => {
    setSelectedFiles(prev => {
      const newSet = new Set(prev)
      if (event.shiftKey && lastClickedIndex !== null) {
        const start = Math.min(lastClickedIndex, idx)
        const end = Math.max(lastClickedIndex, idx)
        for (let i = start; i <= end; i++) newSet.add(filteredFiles[i])
      } else {
        if (newSet.has(file)) newSet.delete(file)
        else newSet.add(file)
      }
      return newSet
    })
    setLastClickedIndex(idx)
  }

  const handleSelectAll = () => setSelectedFiles(new Set(filteredFiles))
  const handleDeselectAll = () => setSelectedFiles(new Set())

  const handleUploadClick = async () => {
    once = false
    try {
      setStatus(statuses.uploading)
      setShowModal(true)
      setLoadedFileCount(0)
      setProgressLabel("Uploading")
      setProgressNumber("0/" + selectedFiles.size)
      setProgressWidth(0)

      const number_of_files = selectedFiles.size
      const selectedArray = Array.from(selectedFiles)

      for (let i = 0; i < selectedArray.length; i++) {
        const file = selectedArray[i]
        const data = new Uint8Array(await file.arrayBuffer())
        const response = await window.api.uploadImage(file._webkitRelativePath, data)
        if (!response.ok) console.log('Failed to upload image. ' + response.error)

        setLoadedFileCount(i + 1)
        setProgressNumber(i + 1 + "/" + number_of_files)
        setProgressWidth(((i + 1) / number_of_files) * 100)
      }

      setProgressNumber(number_of_files + "/" + number_of_files)
      setProgressWidth(100)
      setProgressLabel("Done")

      setTimeout(() => {
        once = true
        navigate('/uploads')
      }, 1000)
    } catch (error) {
      console.error('Upload error:', error)
      setStatus(statuses.error)
      dispatch(
        add_message({
          message: `${error}`,
          status: bannerStatuses.error
        })
      )
    }
  }

  // Dark mode
  const [darkMode, setDarkMode] = React.useState(false)
  React.useEffect(() => {
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains('dark-mode') ||
        document.documentElement.getAttribute('theme') === 'dark' ||
        localStorage.getItem('darkMode') === 'true'
      setDarkMode(isDark)
    }
    checkDarkMode()
    const observer = new MutationObserver(() => checkDarkMode())
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'theme'] })
    window.addEventListener('storage', (e) => { if (e.key === 'darkMode') checkDarkMode() })
    return () => { observer.disconnect(); window.removeEventListener('storage', checkDarkMode) }
  }, [])
  const uploadIcon = darkMode ? yellow_upload : black_upload

  return (
    <section className="upload-page-main">
      <div className="uploadPageStyle">
        <div
          className="drop-zone"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <button
            className={clsx('drop-zone__button', dragging && `drop-zone__button-active`)}
            type="button"
            onKeyDown={handleButtonKeyDown}
            onClick={handleButtonClick}
          >
            <img src={uploadIcon} alt="Upload images" />
            <br />
            <div className="infoText">
              <span className='dragBoxText'> Drag & Drop Folder or Browse </span> <br/>
              <span className="subtext"> Format: .jpeg, .jpg or .png (max folder size 1GB) </span>
            </div>
          </button>
          <input
            className="visually-hidden"
            id="file_uploader"
            ref={inputRef}
            type="file"
            accept={acceptedFileTypes.join(',')}
            multiple
            onChange={handleOnChange}
            webkitdirectory="true"
            directory="true"
          />

          {/* File list */}
          {files.length > 0 && (
            <div className="file-list">

              <div className="file-list-header">
                <h3>Files in selected folder:</h3>
                <input
                  type="text"
                  placeholder="Search files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ marginLeft: "1rem", padding: "0.25rem", width: "200px" }}
                />
                <button onClick={handleSelectAll}>Select All</button>
                <button onClick={handleDeselectAll}>Deselect All</button>
              </div>

              <div className="file-list-content">
                <ul>
                  {filteredFiles.map((file, idx) => (
                    <li key={idx}>
                      <input
                        type="checkbox"
                        checked={selectedFiles.has(file)}
                        onClick={(e) => handleCheckboxClick(file, idx, e)}
                      />
                      {file._webkitRelativePath || file.webkitRelativePath || file.name}
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          )}

          {selectedFiles.size > 0 && status !== statuses.uploading && (
            <button className="upload-selected-btn" onClick={handleUploadClick}>
              Upload Selected Images
            </button>
          )}
        </div>

        {/* Progress info */}
        {status === statuses.uploading && (
          <div className="upload-progress-info">
            <table className="uploadTable">
              <tbody>
                <tr>
                  <th className="progressLabel">{progressLabel}</th>
                  <th className="progressNumber">{progressNumber}</th>
                </tr>
              </tbody>
            </table>
            <div className="progressBarZone">
              <div
                id="progressBarProgress"
                style={{ width: `${progressWidth}%` }}
              ></div>
            </div>
          </div>
        )}

      </div>
    </section>
  )
}
