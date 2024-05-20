import { AirComponent, createState, html, airCss } from '../air-js/core/air.js';

export const TaskBoard = AirComponent('task-board', function() {
  const [tasks, setTasks] = createState({
    todo: ['Task 1', 'Task 2'],
    inProgress: ['Task 3'],
    done: ['Task 4']
  });

  const theme = {
    colors: {
      primary: '#3498db',
      secondary: '#2ecc71',
      background: '#ecf0f1',
      font: '#2c3e50'
    },
    fontSize: '14pt',
    padding: '15px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
  };

  const styles = {
    board: airCss({
      display: 'flex',
      justifyContent: 'space-around',
      padding: theme.padding,
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius,
      boxShadow: theme.boxShadow
    }),
    column: airCss({
      width: '30%',
      backgroundColor: theme.colors.primary,
      padding: theme.padding,
      borderRadius: theme.borderRadius,
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }),
    task: airCss({
      backgroundColor: '#fff',
      color: theme.colors.font,
      padding: '10px',
      margin: '10px 0',
      borderRadius: theme.borderRadius,
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      cursor: 'grab'
    })
  };

  const handleDragStart = (event, task, status) => {
    event.dataTransfer.setData('task', task);
    event.dataTransfer.setData('status', status);
    console.log("Drag Start - task:", task, "status:", status);
  };

  const handleDrop = (event, newStatus) => {
    const task = event.dataTransfer.getData('task');
    const oldStatus = event.dataTransfer.getData('status');
    console.log("Drop - task:", task, "from:", oldStatus, "to:", newStatus);
    if (task && oldStatus) {
      setTasks(prev => {
        const updatedTasks = { ...prev };
        updatedTasks[oldStatus] = updatedTasks[oldStatus].filter(t => t !== task);
        updatedTasks[newStatus].push(task);
        console.log("Updated Tasks:", updatedTasks);
        return updatedTasks;
      });
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };
  const test = (e) => {
    console.log("test")
  }
  return () => html` 
    <div style="${styles.board}">
      ${['todo', 'inProgress', 'done'].map(status => html`
        <div
          style="${styles.column}" 
          ondrop="${(e)=>handleDrop(e, status)}"
          onclick="${test}"
          ondragover="${handleDragOver}"
        >
          <h2>${status.charAt(0).toUpperCase() + status.slice(1)}</h2>
            ${tasks[status].map(task => html`
            <div
              style="${styles.task}"
              draggable="true"
              ondragstart="${(e) => handleDragStart(e, task, status)}"
            >
              ${task}
            </div>
          `)}
        </div>
      `)}
    </div>
  `;
});
