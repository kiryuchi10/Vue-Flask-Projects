// pages/TodoPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const TodoPage = () => {
  const { date } = useParams();
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    // Fetch existing to-dos for the date from your API
    // Example API call, replace with actual endpoint and logic
    const fetchTodos = async () => {
      const response = await fetch(`/api/todos/${date}`);
      const data = await response.json();
      setTodos(data);
    };

    fetchTodos();
  }, [date]);

  const handleAddTodo = async () => {
    if (newTodo.trim() === '') return;

    // Add new to-do via your API
    await fetch(`/api/todos/${date}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: newTodo }),
    });

    setTodos([...todos, { text: newTodo }]);
    setNewTodo('');
  };

  const handleDeleteTodo = async (todoText) => {
    // Delete to-do via your API
    await fetch(`/api/todos/${date}/${todoText}`, { method: 'DELETE' });

    setTodos(todos.filter(todo => todo.text !== todoText));
  };

  return (
    <div>
      <h1>To-Do for {date}</h1>
      <input
        type="text"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="Add a new to-do"
      />
      <button onClick={handleAddTodo}>Add</button>
      <ul>
        {todos.map(todo => (
          <li key={todo.text}>
            {todo.text}
            <button onClick={() => handleDeleteTodo(todo.text)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoPage;
