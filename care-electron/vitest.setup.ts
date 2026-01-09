import '@testing-library/jest-dom'
import { vi } from 'vitest'

vi.mock('electron', () => {
  return {
    ipcRenderer: {
      invoke: vi.fn(),
      on: vi.fn(),
      send: vi.fn()
    },
    ipcMain: {
      handle: vi.fn(),
      on: vi.fn()
    },
    BrowserWindow: vi.fn()
  }
})
