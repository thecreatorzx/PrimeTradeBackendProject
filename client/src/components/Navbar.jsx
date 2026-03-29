import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout')
      logout()
      navigate('/login')
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <nav className='bg-white shadow-sm px-6 py-4 flex items-center justify-between'>
      <h1 className='text-xl font-bold text-blue-600'>Task Manager</h1>
      <div className='flex items-center gap-4'>
        <div className='flex items-center gap-3'>
          <div className='w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center'>
            <span className='text-blue-600 text-sm font-bold'>
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className='leading-tight'>
            <p className='text-sm font-semibold text-gray-800'>{user?.name}</p>
            <p className='text-xs text-gray-400'>{user?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className='bg-red-500 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-red-600'
        >
          Logout
        </button>
      </div>
    </nav>
  )
}

export default Navbar