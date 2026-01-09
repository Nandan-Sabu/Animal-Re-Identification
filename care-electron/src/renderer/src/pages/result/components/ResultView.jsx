import { useState } from 'react'
import closeIcon from '../../../assets/close.png'
import { Button } from '../../../components/Button.jsx'
import { Heading } from '../../../components/Heading.jsx'
import TreeItem from '../../../components/TreeItem.jsx'
import TreeView from '../../../components/TreeView.jsx'

// Displays the result gallery with folder navigation, file list, and image preview
export default function ResultView({ folders, files }) {
  const [currentFolder, setCurrentFolder] = useState('')
  const [selected, setSelected] = useState(new Set())
  const [preview, setPreview] = useState(null)

  // Handles previewing an image file by fetching its data
  const handlePreview = async (file) => {
    const [date, ...paths] = file.path.split('/')
    const response = await window.api.viewDetectImage(date, paths.join('/'))
    const blob = new Blob([response.data], { type: 'application/octet-stream' })
    setPreview({
      name: file.name,
      src: URL.createObjectURL(blob)
    })
  }

  return (
    // Main container for the result gallery view
    <div className="uploads-view">
      {/* Sidebar: Folder navigation tree */}
      <div className="uploads-folder-list">
        <TreeView onSelectedChange={(itemId) => setCurrentFolder(itemId)}>
          <TreeList folders={folders}></TreeList>
        </TreeView>
      </div>
      {/* Main area: File list or welcome message */}
      <div className="uploads-file-list">
        {currentFolder ? (
          <FileList
            files={files.filter((item) => item.parent === currentFolder)}
            selected={selected}
            setSelected={setSelected}
            handlePreview={handlePreview}
          ></FileList>
        ) : (
          // Shown when no folder is selected
          <div className="uploads-file-list-warning">Welcome to your Result Gallery</div>
        )}
      </div>
      {/* Image preview panel */}
      {preview && (
        <div className="uploads-preview">
          <div className="uploads-preview__title">
            <Heading level={2}>{preview.name}</Heading>
            <Button
              className="uploads-preview__close-button"
              onClick={() => {
                setPreview(null)
              }}
            >
              <img alt="Close preview" className="uploads-preview__close-icon" src={closeIcon} />
            </Button>
          </div>
          <img src={preview.src} className="primary-preview" />
        </div>
      )}
    </div>
  )
}

// Renders a recursive tree list of folders
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

// Renders the list of files in the selected folder, with selection and preview
function FileList({ files, selected, setSelected, handlePreview }) {
  if (files.length) {
    return (
      // Container for the file list section
      <div className="uploads">
        {/* Title bar for the file list */}
        <div className="uploads__title">
          <Heading level={2}>Image List</Heading>
        </div>
        {/* Scrollable area containing the file list */}
        <div className="uploads__scrollable-container">
          {/* List of files and select all option */}
          <ul className="uploads__list">
            {/* Select all checkbox row */}
            <li className="uploads__list__item uploads__list__item_title">
              <input
                type="checkbox"
                checked={files.every((file) => selected.has(file.path))}
                onChange={() => {
                  setSelected(() => {
                    const newSelected = new Set(selected)
                    if (files.every((file) => newSelected.has(file.path))) {
                      files.forEach((file) => newSelected.delete(file.path))
                    } else {
                      files.forEach((file) => newSelected.add(file.path))
                    }
                    return newSelected
                  })
                }}
              />
              {/* Label for select all */}
              <div className="uploads__list__item__fileinfo">Select All</div>
            </li>
            {/* Individual file rows */}
            {files.map((file, index) => (
              <li className="uploads__list__item" key={`${file.name}-${index}}`}>
                {/* Checkbox for selecting individual file */}
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
                />
                {/* File info and preview trigger */}
                <div className="uploads__list__item__fileinfo">
                  {/* <img
                  className="file-preview"
                  src={file.src}
                  onClick={() => setPreview(file)}
                /> */}
                  <span className="file-name" onClick={() => handlePreview(file)}>
                    {file.name}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  } else {
    return null
  }
}
