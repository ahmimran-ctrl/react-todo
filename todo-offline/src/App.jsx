import { useState } from 'react'
import { useTodos } from './context/TodoContext'

function App() {
  const [input, setInput] = useState('')
  const { todos, addTodo, toggleTodo, deleteTodo } = useTodos() // Context থেকে আনো

  const handleAdd = () => {
    if (input.trim()) {
      addTodo(input) // dispatch এর বদলে addTodo
      setInput('')
    }
  }

  return (
    <>
      <h1>React Todo v10.0 - Context API</h1>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={handleAdd}>Add</button>
      
      {todos.map(todo => (
        <div key={todo.id}>
          <span onClick={() => toggleTodo(todo.id)}>{todo.text}</span>
          <button onClick={() => deleteTodo(todo.id)}>X</button>
        </div>
      ))}
    </>
  )
}

export default App