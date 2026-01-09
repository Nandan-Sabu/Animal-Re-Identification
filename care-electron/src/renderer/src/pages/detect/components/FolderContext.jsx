// FolderContext.jsx
import { createContext, useState, useContext } from 'react'

const FolderContext = createContext()

export const FolderProvider = ({ children }) => {
  const [currentFolder, setCurrentFolder] = useState('')
  const [hasSelectedFile, setHasSelectedFile] = useState(false)

  return (
    <FolderContext.Provider value={{ currentFolder, setCurrentFolder, hasSelectedFile, setHasSelectedFile }}>
      {children}
    </FolderContext.Provider>
  )
}

export const useFolder = () => useContext(FolderContext)
