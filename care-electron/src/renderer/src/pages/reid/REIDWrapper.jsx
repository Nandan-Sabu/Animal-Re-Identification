/** @format */

{/*
  Current bugs:
  Floating button highlighted when hovered over in bottem right of footer
  Select all with subfolders not working
*/}


import "./components/ReIDView.css"
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Heading } from '../../components/Heading'
import { add_message, bannerStatuses } from '../../utils/bannerSlice'
import ImagesView from './components/REID'


export default function ReIDImages() {
  const dispatch = useDispatch()
  const [detects, setDetects] = useState([])

  useEffect(() => {
    async function getAllFolders(folders = [], date = '', time = '', groupId = '') {
      console.log('date:', date, 'time:', time, 'group_id:', groupId)
      try {
        const response = await window.api.browseReidImage(date, time, groupId)
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
          folders.push({
            ...item,
            parent: `${date ? date + '/' : ''}${time ? time + '/' : ''}${
              groupId ? groupId + '/' : ''
            }`,
            path: `${date ? date + '/' : ''}${time ? time + '/' : ''}${
              groupId ? groupId + '/' : ''
            }${item.name}`
          })

          await getAllFolders(
            folders,
            date || item.date,
            time || item.time || '',
            item.group_id || groupId || ''
          )
        }

        if (date === '' && time === '' && groupId === '') {
          setDetects(folders)
        }
      } catch (err) {
        console.error(err)
        dispatch(
          add_message({
            message:
              'Something went wrong getting folders. Please contact a developer for further assistance.',
            status: bannerStatuses.error
          })
        )
      }
    }

    getAllFolders()
  }, [])

  return (
    <div style={{ height: "100%" }}>       {/*TODO: This isnt defined in the local css*/}
      {detects && detects?.length > 0 ? (
        <div style={{ height: "100%" }}>      {/*TODO: This isnt defined in the local css*/}
          <ImagesView detects={detects} />
        </div>
      ) : (
        <div className="uploads-list uploads-list--empty">No ReID images found</div>
      )}
    </div>
  )
}
