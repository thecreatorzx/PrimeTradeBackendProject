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
        <span className='text-sm text-gray-600'>Hello, {user?.name}</span>
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