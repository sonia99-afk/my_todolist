import React, { useState } from 'react';
import axios from 'axios';

import './TodoApp.css'; // Подключаем CSS файл для стилей

const TodoApp = () => {
  const [tasks, setTasks] = useState([]);
  const [first_meet, setFirst] = useState(true);
  const [taskInput, setTaskInput] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [imageSrc, setImageSrc] = useState('cat2.jpg'); // Исходная картинка
  
  const server_url = process.env.SERVER_URI || "https://my-todolist-v86u.onrender.com";

  const getTasks = () => {
    axios.get(server_url+"/task").then((r) => {
      if (r.data.length > 0) {
        setImageSrc('cat2.jpg');
      } else {
        setImageSrc('cat3.jpg');
      }
      setTasks(r.data);
    }); 
  } 

  const createTask = (text) => {
    axios.post(server_url+"/task",{'text': text}).then((r) => {
      getTasks();
    }); 
  } 

  const editTask = (id, text) => {
    axios.put(server_url+"/task/"+id,{'text': text}).then((r) => {
      getTasks();
    }); 
  }

  const deleteTask = (id) => {
    axios.delete(server_url+"/task/"+id).then((r) => {
      getTasks();
    }); 
  } 

  if (first_meet) {
    getTasks();
    setFirst(false);
  }

  const addOrUpdateTask = () => {
    if (taskInput.trim() === '') return;

    if (editIndex !== null) {
      editTask(editIndex,taskInput);
      setEditIndex(null);
    } else {
      createTask(taskInput);
    }
    
    setTaskInput('');
  };

  const startEditing = (id,text) => {
    setTaskInput(text);
    setEditIndex(id);
  };
  
  return (
    <div className="todo-app">
      <h1>To Do:</h1>
      <input 
        type="text" 
        value={taskInput} 
        onChange={(e) => setTaskInput(e.target.value)} 
        placeholder="Напиши задачу!"
      />
      <button onClick={addOrUpdateTask}>
        {editIndex !== null ? 'Обновить' : 'Добавить'}
      </button>
      <ul>
        {tasks.map((task,index) => (
          <li key={task.id}>
            <div class="task-text">{task.text}</div>
            <button onClick={() => startEditing(task.id,task.text)}>Редактировать</button>
            <button onClick={() => deleteTask(task.id)}>Удалить</button>
          </li>
        ))}
      </ul>
      <img src={imageSrc} alt="Задача" className="task-image" />
    </div>
  );
};
export default TodoApp;

