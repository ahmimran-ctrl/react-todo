import { createContext, useReducer, useContext } from 'react'

// 1. Context বানাও
const TodoContext = createContext()

// 2. Reducer ফাংশন - তোমার v9.0 এর কোড এখানে পেস্ট করো
const todoReducer = (state, action) => {
  switch (action.type) {
    case 'ADD':
      return [...state, { id: Date.now(), text: action.payload, completed: false }]
    case 'TOGGLE':
      return state.map(todo => 
        todo.id === action.payload ? { ...todo, completed: !todo.completed } : todo
      )
    case 'DELETE':
      return state.filter(todo => todo.id !== action.payload)
    default:
      return state
  }
}

// 3. Provider বানাও
export const TodoProvider = ({ children }) => {
  const [todos, dispatch] = useReducer(todoReducer, [])

  // Helper ফাংশন বানাও যাতে কম্পোনেন্টে dispatch লেখা না লাগে
  const addTodo = (text) => dispatch({ type: 'ADD', payload: text })
  const toggleTodo = (id) => dispatch({ type: 'TOGGLE', payload: id })
  const deleteTodo = (id) => dispatch({ type: 'DELETE', payload: id })

  return (
    <TodoContext.Provider value={{ todos, addTodo, toggleTodo, deleteTodo }}>
      {children}
    </TodoContext.Provider>
  )
}

// 4. কাস্টম হুক বানাও - ইউজ করা ইজি হবে
export const useTodos = () => {
  const context = useContext(TodoContext)
  if (!context) {
    throw new Error('useTodos must be used within TodoProvider')
  }
  return context
}