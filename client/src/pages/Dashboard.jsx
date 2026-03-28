import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import TaskForm from '../components/TaskForm'
import TaskList from '../components/TaskList'

function Dashboard() {
  const [tasks, setTasks] = useState([])
  const [editingTask, setEditingTask] = useState(null)
  const [loading, setLoading] = useState(true)
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
    try {
      const res = await api.get('/tasks')
      setTasks(res.data.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }
  const fetchAllTasks = async () => {
    try {
      const res = await api.get('/admin/tasks')
      setTasks(res.data.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
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

  const handleCancel = () => {
    setEditingTask(null)
  }

  return (
    <div className='min-h-screen bg-gray-100'>
      <Navbar />
      <div className='max-w-3xl mx-auto px-4 py-8'>
        <button onClick={() => fetchAllTasks()} className='bg-green-500 cursor-pointer text-white px-4 py-1.5 rounded-lg text-sm hover:bg-green-600'>Get all tasks</button>
        <TaskForm
          onSubmit={editingTask ? handleUpdate : handleCreate}
          editingTask={editingTask}
          onCancel={handleCancel}
        />
        <h2 className='text-lg font-semibold text-gray-800 mb-4'>Your Tasks</h2>
        <TaskList
          tasks={tasks}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
        />
      </div>
    </div>
  )
}

export default Dashboard