import { createContext, useReducer, useEffect, useContext } from "react"

const TodoContext = createContext()

const initialState = {
    tasks: JSON.parse(localStorage.getItem('tasks')) || [],
    input: sessionStorage.getItem('draftTask') || '',
    filter: 'all',
    theme: localStorage.getItem('theme') || 'light',
    editingID: null,
    editText: '',
}

function todoReducer(state, action) {
  switch (action.type) {
    case 'SET_INPUT':
      return {...state, input: action.payload }

    case 'ADD_TASK':
      if (state.input.trim() === '') return state
      const newTask = { text: state.input.trim(), done: false, id: Date.now() }
      return {state, tasks: [...state.tasks, newTask], input: '' }

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
      return {...state, editingID: action.payload.id, editText: action.payload.text }

    case 'SET_EDIT_TEXT':
      return {...state, editText: action.payload }

    case 'SAVE_EDIT':
      if (state.editText.trim() === '') return state
      return {
       ...state,
        tasks: state.tasks.map(t =>
          t.id === state.editingID? {...t, text: state.editText.trim() } : t
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

export function TodoProvider({ children }) {
    const [state, dispatch] = useReducer(todoReducer, initialState)

// 3. localStorage/sessionStorage সেভ
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(state.tasks))
  }, [state.tasks])

  useEffect(() => {
    sessionStorage.setItem('draftTask', state.input)
  }, [state.input])

  useEffect(() => {
    localStorage.setItem('theme', state.theme)
  }, [state.theme])

  return (
    <TodoContext.Provider value={{ state, dispatch}}>
        {children}
    </TodoContext.Provider>
  )
}

export function useTodo() {
    const context = useContext(TodoContext)
    if(!context) {
        throw new Error('useTodo must be used within TodoProvider')
    }
    return context
}
