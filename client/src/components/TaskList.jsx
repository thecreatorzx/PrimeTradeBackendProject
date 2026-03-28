import TaskCard from './TaskCard'

function TaskList({ tasks, onEdit, onDelete, loading }) {
  if (loading) {
    return <p className='text-gray-500 text-sm'>Loading tasks...</p>
  }

  if (tasks.length === 0) {
    return <p className='text-gray-500 text-sm'>No tasks yet. Create one above.</p>
  }

  return (
    <div className='space-y-4'>
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}

export default TaskList