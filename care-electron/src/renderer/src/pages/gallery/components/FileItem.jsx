import { useRef, useEffect } from 'react'
import { Button } from '../../../components/Button'
import classNames from 'classnames'

export default function FileItem({
  files,
  currentItems,
  selected,
  setSelected,
  preview,
  handlePreview,
  handleSelectAll,
  handleDeselectAll,
  allSelected
}) {
  const selectAllRef = useRef()

  useEffect(() => {
    if (selectAllRef.current) {
      const totalFiles = files.length
      const selectedFilesCount = files.filter((file) => selected.has(file.path)).length
      selectAllRef.current.indeterminate = selectedFilesCount > 0 && selectedFilesCount < totalFiles
    }
  }, [files, selected])

  return (
    <>
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
            <span className="file-name" title={file.name}>{file.name}</span>
          </li>
        ))}
      </ul>
    </>
  )
}
