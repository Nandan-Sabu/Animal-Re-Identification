/** @format */

import './viewuploads.css'
import { useEffect, useState } from 'react'
// Redux is used to manage global state for the banner messages
import { useDispatch } from 'react-redux'
import { Heading } from '../../components/Heading'
// bannerSlice is used to manage the banner messages
import { add_message, bannerStatuses } from '../../utils/bannerSlice'
import UploadsView from './components/UploadsView'

export default function Uploads() {
  // useDispatch is used to dispatch actions to the Redux store
  const dispatch = useDispatch()
  // current state is empty array 
  const [uploads, setUploads] = useState([])

  useEffect(() => {
    // Recursive function to get all uploads
    async function getAllUploads(files = [], date = '', folderPath = '') {
      //adding some logging to help DEBUG issues with loading uploads
      console.log(`date: ${date}`)
      console.log(`folderPath: ${folderPath}`)
      try {
        // Call the browseImage API to get the list of files and directories
        const response = await window.api.browseImage(date, folderPath)
        // Check if the response is ok
        if (!response.ok) {
          console.error(`!response.ok: ${response.error}`)
          // If not, dispatch an error message to the banner
          dispatch(
            add_message({
              message:
                'Something went wrong getting upload information. Please contact a developer for further assistance.',
              status: bannerStatuses.error
              })
            )
            return
          } // still in the if (!response.ok) block

        // Loop through the files and directories
        for (const item of response.files) {
          // If the item is a directory, recursively call getAllUploads
          if (!item.isDirectory) continue
          // Add the item to the files array with the correct path
          // The parent is the date folder and the current folder path
          // The path is the date folder and the item path
          files.push({
            ...item,
            parent: `${date ? date + '/' : ''}${folderPath ? folderPath + '/' : ''}`,
            path: `${date ? date + '/' : ''}${item.path}`
          })
          await getAllUploads(files, date ? date : item.path, date ? item.path : '')
        }
        // If the date is empty, set the uploads state to the files array
        if (date === '') {
          setUploads(files)
        }
      } catch (err) {
        console.error(`getAllUploads error: ${err}`)
        dispatch(
          add_message({
            message:
              'Something went wrong getting upload information. Please contact a developer for further assistance.',
            status: bannerStatuses.error
          })
        )
      }
    }
    // Call the getAllUploads function on component mount
    getAllUploads()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // if uploads exist, render the UploadsView component with the uploads prop
  // else render a message saying no uploads found

  // send the data(uploads) to the UploadsView component to render the uploads
  return (
    <div className="uploads-wrapper">
      {uploads && uploads?.length > 0 ? (
        <div className="uploads-list">
          <UploadsView uploads={uploads} />
        </div>
      ) : (
        <div className="uploads-list uploads-list--empty" style={{"margin-top": "20px"}}>No uploads found</div>
      )}
    </div>
  )
}
