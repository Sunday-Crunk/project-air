import { AirComponent, html, createState, airCss, Router, onMount, onUnMount, globalState } from '../air-js/core/air.js';

// Global state for theme
const [theme, setTheme] = createState('light', { global: 'app-theme' });

// Styles
const styles = {
  app: airCss({
    fontFamily: 'Arial, sans-serif',
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: () => theme() === 'light' ? '#f0f0f0' : '#333',
    color: () => theme() === 'light' ? '#333' : '#f0f0f0',
    transition: 'all 0.3s ease',
  }),
  button: airCss({
    padding: '10px 15px',
    margin: '5px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    backgroundColor: '#007bff',
    color: 'white',
    _hover: {
      backgroundColor: '#0056b3',
    },
  }),
  input: airCss({
    padding: '10px',
    margin: '5px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  }),
};

// Task Component
const Task = AirComponent('task-item', function(props) {
  const [isEditing, setIsEditing] = createState(false);
  const [editedText, setEditedText] = createState(props.task.text);

  const handleEdit = () => {
    if (isEditing()) {
      props.onEdit(props.task.id, editedText());
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  return () => html`
    <li style="${airCss({ display: 'flex', alignItems: 'center', marginBottom: '10px' })()}">
      ${isEditing() 
        ? html`<input style="${styles.input()}" value="${editedText()}" onInput="${(e) => setEditedText(e.target.value)}" />`
        : html`<span style="${airCss({ textDecoration: props.task.completed ? 'line-through' : 'none' })()}">${props.task.text}</span>`
      }
      <button style="${styles.button()}" onclick="${handleEdit}">${isEditing() ? 'Save' : 'Edit'}</button>
      <button style="${styles.button()}" onclick="${() => props.onToggle(props.task.id)}">
        ${props.task.completed ? 'Undo' : 'Complete'}
      </button>
      <button style="${styles.button()}" onclick="${() => props.onDelete(props.task.id)}">Delete</button>
    </li>
  `;
});

// TaskList Component
const TaskList = AirComponent('task-list', function() {
  const [tasks, setTasks] = createState([{ id: Date.now(), text: "tezt", completed: false }]);
  console.log("tasks: ", tasks())
  const [newTaskText, setNewTaskText] = createState('');
    tasks.onUpdate((tasks) => {
    console.log("tasks: ", tasks)
  })
  const addTask = () => {
    console.log("adding task: ", newTaskText(), tasks())
    if (newTaskText().trim()) {
      setTasks( tasks().concat([{ id: Date.now(), text: newTaskText(), completed: false }]));
      setNewTaskText('');
    }
  };

  const deleteTask = (id) => {
    setTasks(tasks().filter(task => task.id !== id));
  };

  const toggleTask = (id) => {
    setTasks(tasks().map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const editTask = (id, newText) => {
    setTasks(tasks().map(task => 
      task.id === id ? { ...task, text: newText } : task
    ));
  };

  onMount(() => {
    console.log('TaskList component mounted');
    return () => console.log('TaskList component will unmount');
  });

  return () => html`
    <div>
      <h2>My Tasks</h2>
      <input 
        style="${styles.input()}" 
        value="${newTaskText()}" 
        oninput="${(e) => setNewTaskText(e.target.value)}"
        placeholder="Enter a new task"
      />
      <button style="${styles.button()}" onclick="${() => addTask()}">Add Task</button>
      <ul>
        ${tasks().map(task => html`
          <task-item 
            key="${task.id}" 
            props=${{ 
              task, 
              onDelete: deleteTask, 
              onToggle: toggleTask, 
              onEdit: editTask 
            }}
          ></task-item>
        `)}
      </ul>
      <button style="${styles.button()}">Undo Last Action</button>
    </div>
  `;
});

// Settings Component
const Settings = AirComponent('settings-page', function() {
  const [themeState, setThemeState] = globalState('app-theme');

  return () => html`
    <div>
      <h2>Settings</h2>
      <button style="${styles.button()}" onclick="${() => setThemeState(themeState() === 'light' ? 'dark' : 'light')}">
        Toggle ${themeState() === 'light' ? 'Dark' : 'Light'} Mode
      </button>
    </div>
  `;
});

// Main App Component
export const TaskApp = AirComponent('task-manager-app', function() {
  Router.Routes([
    { path: '/', component: 'task-list' },
    { path: '/settings', component: 'settings-page' },
  ]);

  return () => html`
    <div style="${styles.app()}">
      <h1>Personal Task Manager</h1>
      <nav>
        <route href="/">Tasks</route> | 
        <route href="/settings">Settings</route>
      </nav>
      <router></router>
    </div>
  `;
});
