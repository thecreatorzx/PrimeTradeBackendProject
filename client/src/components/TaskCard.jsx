function TaskCard({ task, onEdit, onDelete }) {
  const statusColors = {
    'pending': 'bg-yellow-100 text-yellow-700',
    'in-progress': 'bg-blue-100 text-blue-700',
    'completed': 'bg-green-100 text-green-700'
  }

  return (
    <div className='bg-white p-5 rounded-xl shadow-sm border border-gray-100'>
      <div className='flex items-start justify-between gap-4'>
        <div className='flex-1'>
          <h3 className='font-semibold text-gray-800'>{task.title}</h3>
          {task.description && (
            <p className='text-sm text-gray-500 mt-1'>{task.description}</p>
          )}
          <span className={`inline-block mt-2 text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[task.status]}`}>
            {task.status}
          </span>
        </div>

        <div className='flex gap-2'>
          <button
            onClick={() => onEdit(task)}
            className='text-sm bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-200'
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className='text-sm bg-red-100 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-200'
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default TaskCard