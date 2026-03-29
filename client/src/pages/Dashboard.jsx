import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import TaskForm from '../components/TaskForm'
import TaskList from '../components/TaskList'

function Dashboard() {
  const [tasks, setTasks] = useState([])
  const [users, setUsers] = useState([])
  const [editingTask, setEditingTask] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAdminView, setIsAdminView] = useState(false)
  const [activeTab, setActiveTab] = useState('tasks')
  const { user, setUser } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    fetchUser()
    fetchTasks()
  }, [])

  const fetchUser = async () => {
    try {
      const res = await api.get('/auth/me')
      setUser(res.data.data)
    } catch (err) {
      navigate('/login')
    }
  }

  const fetchTasks = async () => {
    setLoading(true)
    try {
      const res = await api.get('/tasks')
      setTasks(res.data.data)
      setIsAdminView(false)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchAllTasks = async () => {
    setLoading(true)
    try {
      const res = await api.get('/admin/tasks')
      setTasks(res.data.data)
      setIsAdminView(true)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchAllUsers = async () => {
    try {
      const res = await api.get('/admin/users')
      setUsers(res.data.data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    if (tab === 'users' && users.length === 0) fetchAllUsers()
    if (tab === 'tasks') fetchTasks()
  }

  const handleCreate = async (form) => {
    const res = await api.post('/tasks', form)
    setTasks([res.data.data, ...tasks])
  }

  const handleUpdate = async (form) => {
    const res = await api.put(`/tasks/${editingTask.id}`, form)
    setTasks(tasks.map((t) => (t.id === editingTask.id ? res.data.data : t)))
    setEditingTask(null)
  }

  const handleDelete = async (id) => {
    await api.delete(`/tasks/${id}`)
    setTasks(tasks.filter((t) => t.id !== id))
  }

  const handleEdit = (task) => {
    setEditingTask(task)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCancel = () => setEditingTask(null)

  const statusCounts = {
    pending: tasks.filter((t) => t.status === 'pending').length,
    'in-progress': tasks.filter((t) => t.status === 'in-progress').length,
    completed: tasks.filter((t) => t.status === 'completed').length,
  }

  return (
    <div className='min-h-screen bg-gray-100'>
      <Navbar />

      <div className='max-w-3xl mx-auto px-4 py-8'>

        {/* Stats Row */}
        <div className='grid grid-cols-3 gap-4 mb-6'>
          <div className='bg-white rounded-xl p-4 shadow-sm text-center'>
            <p className='text-2xl font-bold text-yellow-500'>{statusCounts.pending}</p>
            <p className='text-xs text-gray-500 mt-1'>Pending</p>
          </div>
          <div className='bg-white rounded-xl p-4 shadow-sm text-center'>
            <p className='text-2xl font-bold text-blue-500'>{statusCounts['in-progress']}</p>
            <p className='text-xs text-gray-500 mt-1'>In Progress</p>
          </div>
          <div className='bg-white rounded-xl p-4 shadow-sm text-center'>
            <p className='text-2xl font-bold text-green-500'>{statusCounts.completed}</p>
            <p className='text-xs text-gray-500 mt-1'>Completed</p>
          </div>
        </div>

        {/* Admin Tabs */}
        {user?.role === 'admin' && (
          <div className='bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6'>
            <p className='text-sm font-semibold text-yellow-700 mb-3'>Admin Controls</p>
            <div className='flex gap-3'>
              <button
                onClick={() => {handleTabChange('tasks'); fetchTasks()}}
                className={`text-sm px-4 py-1.5 rounded-lg font-medium ${activeTab === 'tasks' && !isAdminView ? 'bg-yellow-500 text-white' : 'bg-white border border-yellow-400 text-yellow-600 hover:bg-yellow-50'}`}
              >
                My Tasks
              </button>
              <button
                onClick={() => { handleTabChange('tasks'); fetchAllTasks() }}
                className={`text-sm px-4 py-1.5 rounded-lg font-medium ${activeTab === 'tasks' && isAdminView ? 'bg-yellow-500 text-white' : 'bg-white border border-yellow-400 text-yellow-600 hover:bg-yellow-50'}`}
              >
                All Tasks
              </button>
              <button
                onClick={() => handleTabChange('users')}
                className={`text-sm px-4 py-1.5 rounded-lg font-medium ${activeTab === 'users' ? 'bg-yellow-500 text-white' : 'bg-white border border-yellow-400 text-yellow-600 hover:bg-yellow-50'}`}
              >
                All Users
              </button>
            </div>
          </div>
        )}

        {/* Users Table */}
        {activeTab === 'users' && user?.role === 'admin' && (
          <div className='bg-white rounded-xl shadow-sm overflow-hidden mb-6'>
            <table className='w-full text-sm'>
              <thead className='bg-gray-50 text-gray-500 text-xs uppercase'>
                <tr>
                  <th className='px-4 py-3 text-left'>Name</th>
                  <th className='px-4 py-3 text-left'>Email</th>
                  <th className='px-4 py-3 text-left'>Role</th>
                  <th className='px-4 py-3 text-left'>Joined</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-100'>
                {users.map((u) => (
                  <tr key={u.id} className='hover:bg-gray-50'>
                    <td className='px-4 py-3 font-medium text-gray-800'>{u.name}</td>
                    <td className='px-4 py-3 text-gray-500'>{u.email}</td>
                    <td className='px-4 py-3'>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${u.role === 'admin' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className='px-4 py-3 text-gray-400'>
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <>
            <TaskForm
              onSubmit={editingTask ? handleUpdate : handleCreate}
              editingTask={editingTask}
              onCancel={handleCancel}
            />
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-lg font-semibold text-gray-800'>
                {isAdminView ? 'All Users Tasks' : 'Your Tasks'}
                <span className='ml-2 text-sm font-normal text-gray-400'>({tasks.length})</span>
              </h2>
              {isAdminView && (
                <span className='text-xs bg-yellow-100 text-yellow-700 px-2.5 py-1 rounded-full font-medium'>
                  Admin View
                </span>
              )}
            </div>
            <TaskList
              tasks={tasks}
              onEdit={handleEdit}
              onDelete={handleDelete}
              loading={loading}
              isAdminView={isAdminView}
            />
          </>
        )}

      </div>
    </div>
  )
}

export default Dashboard