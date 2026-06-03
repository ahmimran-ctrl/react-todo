import { useReducer, useEffect } from 'react'
import './App.css'

// 1. সব স্টেট এক জায়গায়
const initialState = {
  tasks: JSON.parse(localStorage.getItem('tasks')) || [],
  input: sessionStorage.getItem('draftTask') || '',
  filter: 'all',
  theme: localStorage.getItem('theme') || 'light',
  editingId: null,
  editText: ''
}

// 2. সব লজিক এক ফাংশনে
function todoReducer(state, action) {
  switch (action.type) {
    case 'SET_INPUT':
      return {...state, input: action.payload }

    case 'ADD_TASK':
      if (state.input.trim() === '') return state
      const newTask = { text: state.input.trim(), done: false, id: Date.now() }
      return {...state, tasks: [...state.tasks, newTask], input: '' }

    case 'TOGGLE_TASK':
      return {
       ...state,
        tasks: state.tasks.map(t =>
          t.id === action.payload? {...t, done:!t.done } : t
        )
      }

    case 'DELETE_TASK':
      return {...state, tasks: state.tasks.filter(t => t.id!== action.payload) }

    case 'SET_FILTER':
      return {...state, filter: action.payload }

    case 'TOGGLE_THEME':
      return {...state, theme: state.theme === 'light'? 'dark' : 'light' }

    case 'START_EDIT':
      return {...state, editingId: action.payload.id, editText: action.payload.text }

    case 'SET_EDIT_TEXT':
      return {...state, editText: action.payload }

    case 'SAVE_EDIT':
      if (state.editText.trim() === '') return state
      return {
       ...state,
        tasks: state.tasks.map(t =>
          t.id === state.editingId? {...t, text: state.editText.trim() } : t
        ),
        editingId: null,
        editText: ''
      }

    case 'CANCEL_EDIT':
      return {...state, editingId: null, editText: '' }

    case 'CLEAR_COMPLETED':
      return {...state, tasks: state.tasks.filter(t =>!t.done) }

    default:
      return state
  }
}

function App() {
  const [state, dispatch] = useReducer(todoReducer, initialState)
  const { tasks, input, filter, theme, editingId, editText } = state

  // 3. localStorage/sessionStorage সেভ
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    sessionStorage.setItem('draftTask', input)
  }, [input])

  useEffect(() => {
    localStorage.setItem('theme', theme)
  }, [theme])

  // 4. Filter করা টাস্ক
  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return!task.done
    if (filter === 'completed') return task.done
    return true
  })

  return (
    <div className={`App ${theme}`}>
      <h1>React Todo v9.0 - useReducer</h1>

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
           {theme} mode
        </button>
      </div>

      <ul>
        {filteredTasks.map((task) => (
          <li key={task.id} className={task.done? 'done' : ''}>
            {editingId === task.id? (
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

            {editingId === task.id? (
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