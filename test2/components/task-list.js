import { AirComponent, createState, html } from '../air-js/core/air.js';

export const TaskManagerComponent = AirComponent('task-manager-component', function() {
  const [tasks, setTasks] = createState([]);

  const addTask = () => {
    const taskText = prompt('Please enter a new task:');
    if (taskText) {
      const newTask = {
        id: tasks.length + 1,
        text: taskText,
        completed: false
      };
      setTasks([...tasks, newTask]);
    }
  };

  const toggleTask = (id) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === id) {
        return {...task, completed: !task.completed};
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  const deleteTask = (id) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
  };

  this.onMount = () => {
    console.log('TaskManagerComponent mounted!');
  };

  this.onUnmount = () => {
    console.log('TaskManagerComponent unmounted!');
  };

  return html`
    <style>
      .container {
        padding: 20px;
        font-family: 'Arial', sans-serif;
        background-color: #f4f4f4;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
      h1 {
        color: #333;
      }
      button {
        background-color: #0084ff;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 6px 12px;
        margin-right: 5px;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }
      button:hover {
        background-color: #0056b3;
      }
      ul {
        list-style-type: none;
        padding: 0;
      }
      li {
        margin-bottom: 10px;
        padding: 10px;
        background-color: white;
        border-radius: 4px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      }
      .completed {
        text-decoration: line-through;
        color: #999;
      }
    </style>
    <div class="container">
      <h1>Task Manager</h1>
      <button onclick="${addTask}">Add Task</button>
      <ul>
        ${tasks.map(task => html`
          <li class="${task.completed ? 'completed' : ''}">
            ${task.text}
            <button onclick="${() => toggleTask(task.id)}">Toggle</button>
            <button onclick="${() => deleteTask(task.id)}">Delete</button>
          </li>
        `)}
      </ul>
    </div>
  `;
});
