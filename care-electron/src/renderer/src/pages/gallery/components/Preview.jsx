import { Button } from '../../../components/Button'
import { Heading } from '../../../components/Heading'
import closeIcon from '../../../assets/close.png'
import downloadIcon from '../../../assets/download-icon.svg'
import downloadIconOnclick from '../../../assets/download-icon-click.svg'

const Preview = ({
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
}) => {
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
      {/* <div className="uploads-preview__header">
        <Button className="uploads-preview__close-button button--primary" onClick={closePrev}>
          <img alt="Close preview" className="uploads-preview__close-icon" src={closeIcon} />
        </Button>
      </div> */}
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
        {/* <Heading level={2} className="uploads-preview__title">
          {preview.name}
        </Heading> */}
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

export default Preview