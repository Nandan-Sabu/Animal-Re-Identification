/** @format */

import { createHashRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/home/Home.jsx'
import About from './pages/about/About.jsx'
import Upload from './pages/upload/Upload.jsx'
import PageLayout from './components/PageLayout.jsx'
import Images from './pages/detect/FilterHeader.jsx'
import Uploads from './pages/gallery/ViewUploads.jsx'
import UserGuide from './pages/user-guide/UserGuide.jsx'
import Error from './components/Error.jsx'
import REIDImageGallery from './pages/reid/REIDWrapper.jsx'
import Result from './pages/result/Result.jsx'
import Settings from './pages/setting/Settings.jsx'

const router = createHashRouter([
  {
    path: '/',
    element: <PageLayout component={<Home />} />
  },
  {
    path: 'upload',
    element: <PageLayout component={<Upload />} />
  },
  {
    path: 'images',
    element: <PageLayout component={<Images />} />
  },
  {
    path: 'about',
    element: <PageLayout component={<About />} />
  },
  {
    path: 'user-guide', 
    element: <PageLayout component={<UserGuide />} />
  },
  {
    path: '/reid',
    element: <PageLayout component={<REIDImageGallery />} />
  },
  {
    path: '/uploads', //Image Gallery
    element: <PageLayout component={<Uploads />} />
  },
  {
    path: '/result',
    element: <PageLayout component={<Result />} />
  },
  {
    path: '*',
    element: <PageLayout component={<Error />} />
  },
  {
    path: '/settings',
    element: <PageLayout component={<Settings />} />
  }
])

function App() {
  return <RouterProvider router={router} />
}

export default App
