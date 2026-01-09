/** @format */

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import LoadSettings from './pages/setting/LoadSettings.jsx'

import './index.css'

import { Provider } from 'react-redux'
import { store, persistor } from '../configureStore.js'
import { PersistGate } from 'redux-persist/integration/react'
import { FolderProvider } from './pages/detect/components/FolderContext'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <FolderProvider>
          <LoadSettings />
          <App />
        </FolderProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
)
