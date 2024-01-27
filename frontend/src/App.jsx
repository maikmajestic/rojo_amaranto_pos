import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import Layout from './components/Layout/Layout'
import Home from './pages/Home/Home'
import Sales from './pages/Home/Sales'
import "./App.css"

function App() {
  const router = createBrowserRouter([
    {
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/sales",
          element: <Sales />,
        },
      ],
    },
  ])

  return (
    <RouterProvider router={router} />
  )
}

export default App
