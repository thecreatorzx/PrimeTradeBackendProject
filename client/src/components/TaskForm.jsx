import { useState, useEffect } from 'react'

function TaskForm({ onSubmit, editingTask, onCancel }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'pending'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (editingTask) {
      setForm({
        title: editingTask.title,
        description: editingTask.description || '',
        status: editingTask.status
      })
    } else {
      setForm({ title: '', description: '', status: 'pending' })
    }
  }, [editingTask])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await onSubmit(form)
      setForm({ title: '', description: '', status: 'pending' })
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='bg-white p-6 rounded-xl shadow-md mb-6'>
      <h2 className='text-lg font-semibold text-gray-800 mb-4'>
        {editingTask ? 'Update Task' : 'Create Task'}
      </h2>

      {error && <p className='text-red-500 text-sm mb-4'>{error}</p>}

      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Title</label>
          <input
            type='text'
            name='title'
            value={form.title}
            onChange={handleChange}
            className='w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
            placeholder='Task title'
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Description</label>
          <textarea
            name='description'
            value={form.description}
            onChange={handleChange}
            className='w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
            placeholder='Task description (optional)'
            rows={3}
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Status</label>
          <select
            name='status'
            value={form.status}
            onChange={handleChange}
            className='w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            <option value='pending'>Pending</option>
            <option value='in-progress'>In Progress</option>
            <option value='completed'>Completed</option>
          </select>
        </div>

        <div className='flex gap-3'>
          <button
            type='submit'
            disabled={loading}
            className='bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50'
          >
            {loading ? 'Saving...' : editingTask ? 'Update' : 'Create'}
          </button>

          {editingTask && (
            <button
              type='button'
              onClick={onCancel}
              className='bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-300'
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default TaskForm