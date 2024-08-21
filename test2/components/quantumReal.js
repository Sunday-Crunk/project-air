import { AirComponent, createState, html, airCss, onMount, onUnMount, Router} from '../air-js/core/air.js';

// Utility function for quantum calculations
const quantumCalc = {
  waveFunctionCollapse: (psi) => Math.sin(psi) ** 2,
  uncertainty: (x, p) => Math.sqrt(x * p),
  superposition: (a, b) => [Math.cos(a), Math.sin(b)],
};

// ParticleCanvas Component
const ParticleCanvas = AirComponent('particle-canvas', function() {
  const [particles, setParticles] = createState([]);
  const [isObserving, setIsObserving] = createState(false);

  const canvasStyle = airCss({
    width: '100%',
    height: '400px',
    backgroundColor: '#000033',
    position: 'relative',
    overflow: 'hidden',
  });

  const particleStyle = airCss({
    position: 'absolute',
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    transition: 'all 0.5s ease',
  });

  onMount(() => { // onMount is called when the component is mounted
    console.log("mounting particle canvas visualizer")
  })
  
  onMount(() => { // you can set multiple onMount functions
    const intervalId = setInterval(() => { // Intervals are automatically cleared when the component is unmounted
      if (!isObserving()) {
        const newParticles = Array(50).fill().map(() => ({
          x: Math.random() * 100,
          y: Math.random() * 100,
          state: Math.random() > 0.5 ? 'wave' : 'particle',
          color: `hsl(${Math.random() * 360}, 100%, 50%)`,
        }));
        setParticles(newParticles);
      }
    }, 1000);

    return () => clearInterval(intervalId); // But you can also return a cleanup function to be called when the component is unmounted from onMount
  });
  onUnMount(() => { // you can also set onUnmount functions
    console.log("unmounting particle canvas visualizer")
  })

  const toggleObservation = () => {
    setIsObserving(!isObserving());
    if (isObserving()) {
      setParticles(particles().map(p => ({ ...p, state: 'particle' })));
    }
  };

  return () => html`
    <div>
      <div style="${canvasStyle()}">
        ${particles().map((p, i) => html`
          <div key="${i}" style="${particleStyle()}${airCss({
            left: `${p.x}%`,
            top: `${p.y}%`,
            backgroundColor: p.color,
            opacity: p.state === 'wave' ? 0.5 : 1,
            boxShadow: p.state === 'wave' ? '0 0 10px 5px ' + p.color : 'none',
          })()}"></div>
        `)}
      </div>
      <button onclick="${toggleObservation}">
        ${isObserving() ? 'Observing' : 'Stop Observing'}
      </button>
    </div>
  `;
});

// QuantumCircuit Component
const QuantumCircuit = AirComponent('quantum-circuit', function() {
  const [qubits, setQubits] = createState([0, 0, 0]);
  const [gates, setGates] = createState([]);

  const circuitStyle = airCss({
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    padding: '20px',
    backgroundColor: '#1a1a2e',
    borderRadius: '10px',
  });

  const qubitStyle = airCss({
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  });

  const gateStyle = airCss({
    width: '40px',
    height: '40px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border:{ // AirCss supports object syntax for attributes with multiple properties like border, image and font
        width: '2px',
        style: 'solid',
        color: '#4CAF50'
    },
    borderRadius: '5px', // you can also access them with camelCase, all AirCss properties are camelCased
    cursor: 'pointer',
    transition: 'all 0.3s ease', // or you can use the primary CSS syntax for multiple properties
    transform: ()=> qubits().length === 0 ? 'scale(0.8)' : 'scale(1)', // you can also use functions to create a style that is re-evaluated when the state changes
    _hover: { // AirCss supports pseudo-classes with the _ prefix
      backgroundColor: '#4CAF50',
      color: 'white',
    },
  });

  const applyGate = (qubitIndex, gate) => {
    setQubits(qubits().map((q, i) => i === qubitIndex ? (q + 1) % 2 : q));
    setGates([...gates(), { qubit: qubitIndex, type: gate }]);
  };

  const gateTypes = ['H', 'X', 'Y', 'Z'];

  return () => html`
    <div style="${circuitStyle()}">
      ${qubits().map((q, i) => html`
        <div style="${qubitStyle()}">
          <span>Qubit ${i}: |${q}⟩</span>
          ${gateTypes.map(gate => html`
            <button style="${gateStyle()}" onclick="${() => applyGate(i, gate)}">${gate}</button>
          `)}
        </div>
      `)}
      <div>
        <h4>Applied Gates:</h4>
        <p>${gates().map(g => `${g.type} on Q${g.qubit}`).join(' → ')}</p>
      </div>
    </div>
  `;
});

// EntanglementVisualizer Component
const EntanglementVisualizer = AirComponent('entanglement-visualizer', function() {
  const [entangledPairs, setEntangledPairs] = createState([]);

  const visualizerStyle = airCss({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#2c3e50',
    borderRadius: '10px',
  });

  const pairStyle = airCss({
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    margin: '10px 0',
  });

  const particleStyle = airCss({
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '24px',
    fontWeight: 'bold',
    transition: 'all 0.5s ease',
  });

  const createEntangledPair = () => {
    const newPair = {
      id: Date.now(),
      stateA: Math.random() > 0.5 ? '↑' : '↓',
      stateB: null,
      measured: false,
    };
    setEntangledPairs([...entangledPairs(), newPair]);
  };

  const measurePair = (id) => {
    setEntangledPairs(entangledPairs().map(pair => {
      if (pair.id === id && !pair.measured) {
        return {
          ...pair,
          stateB: pair.stateA === '↑' ? '↓' : '↑',
          measured: true,
        };
      }
      return pair;
    }));
  };
  console.log("entangledPairs: ", entangledPairs())
  return () => html`
    <div style="${visualizerStyle()}">
      <button onclick="${createEntangledPair}">Create Entangled Pair</button>
      ${entangledPairs().map(pair => html`
        <div key="${pair.id}" style="${pairStyle()}">
          <div style="${particleStyle()}${airCss({ backgroundColor: pair.stateA === '↑' ? '#3498db' : '#e74c3c' })()}">${pair.stateA}</div>
          <div style="${airCss({ fontSize: '24px' })()}">⇄</div>
          <div style="${particleStyle()}${airCss({ 
            backgroundColor: pair.measured ? (pair.stateB === '↑' ? '#3498db' : '#e74c3c') : '#7f8c8d',
          })()}">${pair.measured ? pair.stateB : '?'}</div>
          ${!pair.measured ? html`<button onclick="${() => measurePair(pair.id)}">Measure</button>` : ''}
        </div>
      `)}
    </div>
  `;
});

// SchrodingerBox Component
const SchrodingerBox = AirComponent('schrodinger-box', function() {
  const [boxState, setBoxState] = createState('closed');
  const [catState, setCatState] = createState('superposition');

  const boxStyle = airCss({
    width: '200px',
    height: '200px',
    border: '4px solid #34495e',
    borderRadius: '10px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '24px',
    cursor: 'pointer',
    transition: 'all 0.5s ease',
    backgroundColor: () => boxState() === 'closed' ? '#34495e' : '#ecf0f1',
  });

  const catStyle = airCss({
    fontSize: '48px',
    transition: 'all 0.5s ease',
    opacity: () => boxState() === 'closed' ? 0.5 : 1,
    filter: () => boxState() === 'closed' ? 'blur(5px)' : 'none',
  });

  const toggleBox = () => {
    if (boxState() === 'closed') {
      setBoxState('open');
      setCatState(Math.random() > 0.5 ? 'alive' : 'dead');
    } else {
      setBoxState('closed');
      setCatState('superposition');
    }
  };

  return () => html`
    <div>
      <div style="${boxStyle()}" onclick="${toggleBox}">
        <span style="${catStyle()}">
          ${catState() === 'superposition' ? '?' : (catState() === 'alive' ? '😺' : '💀')}
        </span>
      </div>
      <p>Box is ${boxState()}. Cat is ${catState()}.</p>
    </div>
  `;
});

// Main App Component
export const QuantumRealmExplorer = AirComponent('quantum-realm-explorer', function() {
  const [currentExperiment, setCurrentExperiment] = createState('circuit');

  const appStyle = airCss({
    fontFamily: "'Roboto', sans-serif",
    backgroundColor: '#0a0a1a',
    color: '#ecf0f1',
    minHeight: '100vh',
    padding: '20px',
  });

  const navStyle = airCss({
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    marginBottom: '20px',
  });

  const navButtonStyle = airCss({
    padding: '10px 20px',
    backgroundColor: '#2980b9',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    _hover: {
      backgroundColor: '#3498db',
    },
  });

  const experimentComponents = {
    particles: `<particle-canvas></particle-canvas>`,
    circuit: `<quantum-circuit></quantum-circuit>`,
    entanglement: `<entanglement-visualizer></entanglement-visualizer>`,
    schrodinger: `<schrodinger-box></schrodinger-box>`,
  };
  const CurrentExperiment = experimentComponents[currentExperiment()];
  console.log("CurrentExperiment: ", CurrentExperiment) // The function logic in the component is executed when the component connects to the DOM, so the initial value is displayed
  return () => html`
    <div style="${appStyle()}">
      <h1>Quantum Realm Explorer</h1>
      <nav style="${navStyle()}">
        ${Object.keys(experimentComponents).map(exp => html`
          <button
            class="sausage"
            style="${navButtonStyle()}background-color:${currentExperiment() === exp ? '#16a085' : '#2980b9'}"
            onclick="${() => setCurrentExperiment(exp)}"> <!-- the template is reevaluated when a state variable is updated -->
          
            ${exp.charAt(0).toUpperCase() + exp.slice(1)}
          </button>
        `)}
      </nav>
      ${experimentComponents[currentExperiment()]}
    </div>
  `;
});