import './App.css'
import { useTodo  } from './context/TodoContext'


function App() {
  const { state, dispatch } = useTodo()
  const { tasks, input, filter, theme, editingID, editText } = state


  // 4. Filter করা টাস্ক
  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return!task.done
    if (filter === 'completed') return task.done
    return true
  })

  return (
    <div className={`App ${theme}`}>
      <h1>React Todo v10.0 - Context API </h1>

      <div className="input-section">
        <input
          value={input}
          onChange={(e) => dispatch({ type: 'SET_INPUT', payload: e.target.value })}
          onKeyDown={(e) => e.key === 'Enter' && dispatch({ type: 'ADD_TASK' })}
          placeholder="টাস্ক লিখো"
        />
        <button onClick={() => dispatch({ type: 'ADD_TASK' })}>Add</button>
      </div>

      <div style={{ margin: '10px 0' }}>
        <button
          onClick={() => dispatch({ type: 'SET_FILTER', payload: 'all' })}
          style={{ fontWeight: filter === 'all'? 'bold' : 'normal', margin: '0 5px' }}
        >
          All
        </button>
        <button
          onClick={() => dispatch({ type: 'SET_FILTER', payload: 'active' })}
          style={{ fontWeight: filter === 'active'? 'bold' : 'normal', margin: '0 5px' }}
        >
          Active
        </button>
        <button
          onClick={() => dispatch({ type: 'SET_FILTER', payload: 'completed' })}
          style={{ fontWeight: filter === 'completed'? 'bold' : 'normal', margin: '0 5px' }}
        >
          Completed
        </button>
        <button onClick={() => dispatch({ type: 'TOGGLE_THEME' })}>
          এখন {theme} মোড। চেঞ্জ করো
        </button>
      </div>

      <ul>
        {filteredTasks.map((task) => (
          <li key={task.id} className={task.done? 'done' : ''}>
            {editingID === task.id? (
              <input
                value={editText}
                onChange={(e) => dispatch({ type: 'SET_EDIT_TEXT', payload: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') dispatch({ type: 'SAVE_EDIT' })
                  if (e.key === 'Escape') dispatch({ type: 'CANCEL_EDIT' })
                }}
                autoFocus
                style={{ flex: 1, marginRight: '10px' }}
              />
            ) : (
              <span
                onDoubleClick={() => dispatch({ type: 'START_EDIT', payload: { id: task.id, text: task.text } })}
                onClick={() => dispatch({ type: 'TOGGLE_TASK', payload: task.id })}
                style={{
                  textDecoration: task.done? 'line-through' : 'none',
                  cursor: 'pointer',
                  flex: 1,
                  opacity: task.done? 0.5 : 1,
                }}
              >
                {task.text}
              </span>
            )}

            {editingID === task.id? (
              <>
                <button onClick={() => dispatch({ type: 'SAVE_EDIT' })}>✓</button>
                <button onClick={() => dispatch({ type: 'CANCEL_EDIT' })}>✕</button>
              </>
            ) : (
              <button onClick={() => dispatch({ type: 'DELETE_TASK', payload: task.id })}>X</button>
            )}
          </li>
        ))}
      </ul>

      <p>মোট টাস্ক: {tasks.length} | দেখাচ্ছে: {filteredTasks.length}</p>
      {tasks.some(task => task.done) && (
        <button onClick={() => dispatch({ type: 'CLEAR_COMPLETED' })}>Clear Completed</button>
      )}
    </div>
  )
}

export default App