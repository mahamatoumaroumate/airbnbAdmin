import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Home, Products } from './pages'
import Error from './pages/Error'
import UpdateProduct from './pages/UpdateProduct'
import HomeLayout from './pages/HomeLayout'

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeLayout />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Home />,
        errorElement: <Error />,
      },
      {
        path: 'products',
        element: <Products />,
        errorElement: <Error />,
      },
      {
        path: 'products/:id',
        element: <UpdateProduct />,
        errorElement: <Error />,
      },
    ],
  },
])
const App = () => {
  return <RouterProvider router={router}></RouterProvider>
}

export default App
