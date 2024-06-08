import { Outlet, Link } from 'react-router-dom'

const HomeLayout = ({ children }) => {
  return (
    <div className='max-w-7xl mx-auto px-8 h-screen grid'>
      <div className='flex items-center justify-center pt-16 gap-4 pl-10'>
        <Link to='/' className='btn'>
          Add Item
        </Link>
        <Link to='/products' className='btn'>
          Products
        </Link>
      </div>

      <Outlet />

      {children}
    </div>
  )
}

export default HomeLayout
