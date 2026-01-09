/** @format */

import './detect.css'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Heading } from '../../components/Heading.jsx'
import { add_message, bannerStatuses } from '../../utils/bannerSlice.js'
import ImagesView from './components/Detect.jsx'
import FilterConfidence from './components/FilterConfidence.jsx'
import FilterDropdown from './components/FilterDropdown.jsx'
import { useFolder } from './components/FolderContext.jsx'

export default function Images() {
  const { currentFolder, hasSelectedFile } = useFolder()
  const dispatch = useDispatch()
  const [detects, setDetects] = useState([])
  const [selectedSpecies, setSpecies] = useState(null)
  const [confLow, setConfLow] = useState('0')
  const [confHigh, setConfHigh] = useState('1')
  const [isLoading, setIsLoading] = useState(false) // Track loading state

  const labels = [
    'No Detection',
    'Bird',
    'Cat',
    'Deer',
    'Dog',
    'Ferret',
    'Goat',
    'Hedgehog',
    'Kiwi',
    'Lagomorph',
    'Livestock',
    'Pig',
    'Possum',
    'Rodent',
    'Stoat',
    'Wallaby'
  ]

  const handleSpeciesSelect = async (species) => {
    setSpecies(species)
  }

  const handleConfidenceChange = ({ confLow, confHigh }) => {
    setConfLow(confLow)
    setConfHigh(confHigh)
  }

  const handleDownload = async () => {
    // Set loading state to true before making the API request
    setIsLoading(true)
    try {
      const response = await window.api.downloadDetectImages(selectedSpecies)
      if (!response.ok) {
        const errorText = await response.text()
        dispatch(
          add_message({
            message: errorText || 'Failed to download images. Please try again.',
            status: bannerStatuses.error
          })
        )
      }
    } catch (err) {
      console.error(err)
      dispatch(
        add_message({
          message: 'Something went wrong while downloading. Please contact a developer.',
          status: bannerStatuses.error
        })
      )
    } finally {
      // Set loading state back to false after the download completes or fails
      setIsLoading(false)
    }
  }

  useEffect(() => {
    async function getAllImages(files = [], date = '', folderPath = '', label = selectedSpecies) {
      console.log('date:', date)
      console.log('folderPath: ', folderPath)
      console.log('label: ', selectedSpecies)
      console.log('##################')
      try {
        const response = await window.api.browseDetectImage(
          date,
          folderPath,
          label,
          parseFloat(confLow),
          parseFloat(confHigh)
        )

        if (!response.ok) {
          console.error(response.error)
          dispatch(
            add_message({
              message:
                'Something went wrong getting upload information. Please contact a developer for further assistance.',
              status: bannerStatuses.error
            })
          )
          return
        }

        for (const item of response.files) {
          if (!item.isDirectory) continue
          files.push({
            ...item,
            parent: `${date ? date + '/' : ''}${folderPath ? folderPath + '/' : ''}`,
            path: `${date ? date + '/' : ''}${item.path}`
          })
          console.log('Folders:', detects)
          await getAllImages(files, date ? date : item.path, date ? item.path : '', label)
        }

        if (date === '') {
          console.log('Files: ')
          setDetects(files)
        }
      } catch (err) {
        console.error(err)
        dispatch(
          add_message({
            message:
              'Something went wrong getting upload information. Please contact a developer for further assistance.',
            status: bannerStatuses.error
          })
        )
      }
    }

    getAllImages()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSpecies, confLow, confHigh])

  
  const snap = (v) => Math.min(1, Math.max(0, Math.round(v / 0.05) * 0.05));
  const lowNum = parseFloat(confLow);
  const highNum = parseFloat(confHigh);

  return (
    <div className="detection-header">
      {(hasSelectedFile || currentFolder) && (
      <div id="LabelDropdown">
        <button className='conf-button'>
          <div className="conf-control">
            <span className="conf-label">
              Confidence: {lowNum.toFixed(2)} - {highNum.toFixed(2)}
            </span>

            <div className="conf-slider">
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={lowNum}
                onChange={(e) => {
                  const v = snap(parseFloat(e.target.value))
                  setConfLow(Math.min(v, parseFloat(confHigh)).toFixed(2))
                }}
                className="conf-range"
              />
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={highNum}
                onChange={(e) => {
                  const v = snap(parseFloat(e.target.value))
                  setConfHigh(Math.max(v, parseFloat(confLow)).toFixed(2))
                }}
                className="conf-range"
              />
              <div
                className="conf-track"
                style={{
                  left: `${lowNum * 100}%`,
                  width: `${(highNum - lowNum) * 100}%`
                }}
              />
            </div>
            {/* <button
              className="conf-reset"
              onClick={() => {
                setConfLow('0')
                setConfHigh('1')
              }}
            >
              Reset
            </button> */}
          </div>
        </button>

        <FilterDropdown
          title={
            selectedSpecies ? `Filter by Species: ${selectedSpecies} ▼` : 'Filter by Species ▼'
          }
          content={labels}
          onItemSelect={handleSpeciesSelect}
        />

        <div
          className="clear-filter-button"
          onClick={() => {
            setSpecies(null)
            setConfLow('0')
            setConfHigh('1')
          }}
        >
          Clear Filter
        </div>
        {/* Download button with loading state */}
        <div className="download-button" onClick={handleDownload} disabled={isLoading}>
          {isLoading
            ? 'Exporting...'
            : selectedSpecies
              ? `Export All ${selectedSpecies}`
              : `Export All Images`}
        </div>
      </div>
      )}

      {detects && detects?.length > 0 ? (
        <div className="uploads-list">
          <ImagesView
            detects={detects}
            label={selectedSpecies}
            confLow={confLow}
            confHigh={confHigh}
          />
        </div>
      ) : (
        <div className="uploads-list uploads-list--empty" style={{"margin-top": "20px"}}>No detect images found</div>
      )}
    </div>
  )
}
