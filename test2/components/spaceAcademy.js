import { AirComponent, createState, html, airCss, globalState } from '../air-js/core/air.js';

// NavBar Component
const NavBar = AirComponent('nav-bar', function() {
  const [currentPage, setCurrentPage] = globalState('currentPage');

  const navStyle = airCss({
    display: 'flex',
    justifyContent: 'space-between',
    padding: '1rem',
    backgroundColor: '#1a1a2e',
    color: '#fff'
  });

  const linkStyle = airCss({
    color: '#fff',
    textDecoration: 'none',
    padding: '0.5rem',
    borderRadius: '4px',
    _hover: {
      backgroundColor: '#34495e'
    }
  });

  return () => html`
    <nav style="${navStyle()}">
      <h1>Cosmic Code Academy</h1>
      <div>
        <a href="#" style="${linkStyle}" onclick="${() => setCurrentPage('courses')}">Courses</a>
        <a href="#" style="${linkStyle}" onclick="${() => setCurrentPage('simulator')}">Space Simulator</a>
        <a href="#" style="${linkStyle}" onclick="${() => setCurrentPage('profile')}">Profile</a>
      </div>
    </nav>
  `;
});

// CourseCatalog Component
const CourseCatalog = AirComponent('course-catalog', function() {
  const [courses] = createState([
    { id: 1, title: 'Intro to Space Programming', difficulty: 'Beginner' },
    { id: 2, title: 'Advanced Alien Algorithms', difficulty: 'Intermediate' },
    { id: 3, title: 'Quantum Computing in Zero Gravity', difficulty: 'Advanced' },
  ]);

  const catalogStyle = airCss({
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1rem',
    padding: '1rem'
  });

  const courseStyle = airCss({
    backgroundColor: '#34495e',
    color: '#ecf0f1',
    padding: '1rem',
    borderRadius: '8px',
    transition: 'transform 0.3s',
    _hover: {
      transform: 'scale(1.05)'
    }
  });

  return () => html`
    <div style="${catalogStyle}">
      ${courses().map(course => html`
        <div style="${courseStyle}">
          <h3>${course.title}</h3>
          <p>Difficulty: ${course.difficulty}</p>
        </div>
      `)}
    </div>
  `;
});

// SpaceSimulator Component
const SpaceSimulator = AirComponent('space-simulator', function() {
  const [code, setCode] = createState('// Write your space code here\n');
  const [output, setOutput] = createState('');

  const simulatorStyle = airCss({
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    padding: '1rem'
  });

  const editorStyle = airCss({
    width: '100%',
    height: '200px',
    backgroundColor: '#2c3e50',
    color: '#ecf0f1',
    fontFamily: 'monospace',
    padding: '0.5rem',
    border: 'none',
    borderRadius: '4px'
  });

  const buttonStyle = airCss({
    backgroundColor: '#2ecc71',
    color: '#fff',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    _hover: {
      backgroundColor: '#27ae60'
    }
  });

  const runSimulation = () => {
    try {
      // This is a simple simulation. In a real app, you'd want to use a proper sandbox.
      const result = eval(code());
      setOutput(`Simulation result: ${result}`);
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    }
  };

  return () => html`
    <div style="${simulatorStyle}">
      <textarea 
        style="${editorStyle}" 
        value=${code()} 
        onInput="${(e) => setCode(e.target.value)}"
      ></textarea>
      <button style="${buttonStyle}" onclick=${runSimulation}>Run Simulation</button>
      <div>${output()}</div>
    </div>
  `;
});

// UserProfile Component
const UserProfile = AirComponent('user-profile', function() {
  const [user, setUser] = createState({
    name: 'Cosmic Coder',
    rank: 'Space Cadet',
    completedCourses: 2
  });

  const profileStyle = airCss({
    backgroundColor: '#34495e',
    color: '#ecf0f1',
    padding: '1rem',
    borderRadius: '8px',
    maxWidth: '400px',
    margin: '1rem auto'
  });

  return () => html`
    <div style="${profileStyle}">
      <h2>${user().name}</h2>
      <p>Rank: ${user().rank}</p>
      <p>Completed Courses: ${user().completedCourses}</p>
    </div>
  `;
});

export const App = AirComponent('space-academy', function() {
    const [currentPage, setCurrentPage] = createState('courses', { global: 'currentPage' });
    const [count, setCount] = createState(0);
    currentPage.onUpdate(()=>console.log("current page: ", currentPage(), currentPage() === 'simulator'))
    const appStyle = airCss({
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#0a0a1a',
      color: '#ecf0f1',
      minHeight: '100vh'
    });
  
    const getPageComponent = () => {
      switch (currentPage()) {
        case 'courses':
          return html`<course-catalog></course-catalog>`;
        case 'simulator':
          return html`<space-simulator></space-simulator>`;
        case 'profile':
          return html`<user-profile></user-profile>`;
        default:
          return ''; // Return empty string or a default component if needed
      }
    };
  
    return () => html`
      <div style="${appStyle}">
        <nav-bar></nav-bar>
        ${getPageComponent()}
      </div>
    `;
  });