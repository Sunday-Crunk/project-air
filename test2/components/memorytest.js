import { AirComponent, createState, html, onMount, onUnMount } from '../air-js/core/air.js';

// Basic Detachment Test (unchanged)
const ChildComponent = AirComponent('child-component', function(props) {
  const { id, onToggle } = props;

  onMount(() => {
    console.log(`Child ${id} mounted`);
    return () => console.log(`Child ${id} cleanup function called`);
  });

  onUnMount(() => {
    console.log(`Child ${id} unmounted`);
  });

  return () => html`
    <div>
      <h3>Child ${id}</h3>
      <button onclick="${onToggle}">Hide me, show the other</button>
    </div>
  `;
});

const DetachmentTestComponent = AirComponent('detachment-test-component', function() {
  const [showChild1, setShowChild1] = createState(true);
  const [showChild2, setShowChild2] = createState(true);

  const toggleChild1 = () => {
    setShowChild1(false);
    setShowChild2(true);
  };

  const toggleChild2 = () => {
    setShowChild1(true);
    setShowChild2(false);
  };

  return () => html`
    <div>
      <h2>1. Detachment Test</h2>
      ${showChild1() ? html`<child-component id="1" props=${{ id: 1, onToggle: toggleChild1 }}></child-component>` : ''}
      ${showChild2() ? html`<child-component id="2" props=${{ id: 2, onToggle: toggleChild2 }}></child-component>` : ''}
    </div>
  `;
});

// State Retention Test (unchanged)
const StateTestChild = AirComponent('state-test-child', function() {
  const stateArray = Array(1000).fill().map(() => createState(Math.random()));
  
  onMount(() => {
    console.log('StateTestChild mounted');
    return () => console.log('StateTestChild cleanup');
  });

  onUnMount(() => {
    console.log('StateTestChild unmounted');
  });

  return () => html`
    <div>Child with 1000 state variables</div>
  `;
});

const StateRetentionTest = AirComponent('state-retention-test', function() {
  const [showChild, setShowChild] = createState(true);

  const toggleChild = () => setShowChild(!showChild());

  return () => html`
    <div>
      <h2>2. State Retention Test</h2>
      <button onclick="${toggleChild}">Toggle State-Heavy Child</button>
      ${showChild() ? html`<state-test-child></state-test-child>` : ''}
    </div>
  `;
});

// Modified Closure and Event Listener Test
const ClosureEventChild = AirComponent('closure-event-child', function() {
  const [count, setCount] = createState(0);
  const [intervalRunning, setIntervalRunning] = createState(false);
  let intervalId = null;

  const startInterval = () => {
    if (!intervalRunning()) {
      intervalId = setInterval(() => {
        setCount(c => c + 1);
      }, 1000);
      setIntervalRunning(true);
    }
  };

  const stopInterval = () => {
    if (intervalRunning()) {
      clearInterval(intervalId);
      setIntervalRunning(false);
    }
  };

  onMount(() => {
    const clickHandler = () => console.log('Clicked!');
    document.addEventListener('click', clickHandler);

    return () => {
      document.removeEventListener('click', clickHandler);
      stopInterval();
    };
  });

  onUnMount(() => {
    console.log('ClosureEventChild unmounted');
  });

  return () => html`
    <div>
      <div>Child with interval and global event listener: ${count()}</div>
      <button onclick="${startInterval}" ${intervalRunning() ? 'disabled' : ''}>Start Interval</button>
      <button onclick="${stopInterval}" ${!intervalRunning() ? 'disabled' : ''}>Stop Interval</button>
    </div>
  `;
});

const ClosureEventTest = AirComponent('closure-event-test', function() {
  const [showChild, setShowChild] = createState(true);

  const toggleChild = () => setShowChild(!showChild());

  return () => html`
    <div>
      <h2>3. Closure and Event Listener Test</h2>
      <button onclick="${toggleChild}">Toggle Closure/Event Child</button>
      ${showChild() ? html`<closure-event-child></closure-event-child>` : ''}
    </div>
  `;
});

// Modified Global State Interaction Test
const [globalCount, setGlobalCount] = createState(0, { global: 'testGlobalCount' });

const GlobalStateChild = AirComponent('global-state-child', function() {
  const [intervalRunning, setIntervalRunning] = createState(false);
  let intervalId = null;

  const startInterval = () => {
    if (!intervalRunning()) {
      intervalId = setInterval(() => {
        setGlobalCount(c => c + 1);
      }, 1000);
      setIntervalRunning(true);
    }
  };

  const stopInterval = () => {
    if (intervalRunning()) {
      clearInterval(intervalId);
      setIntervalRunning(false);
    }
  };

  onUnMount(() => {
    stopInterval();
    console.log('GlobalStateChild unmounted');
  });

  return () => html`
    <div>
      <div>Child interacting with global state: ${globalCount()}</div>
      <button onclick="${startInterval}" ${intervalRunning() ? 'disabled' : ''}>Start Global Interval</button>
      <button onclick="${stopInterval}" ${!intervalRunning() ? 'disabled' : ''}>Stop Global Interval</button>
    </div>
  `;
});

const GlobalStateTest = AirComponent('global-state-test', function() {
  const [showChild, setShowChild] = createState(true);

  const toggleChild = () => setShowChild(!showChild());

  return () => html`
    <div>
      <h2>4. Global State Interaction Test</h2>
      <button onclick="${toggleChild}">Toggle Global State Child</button>
      ${showChild() ? html`<global-state-child></global-state-child>` : ''}
      <div>Global count: ${globalCount()}</div>
    </div>
  `;
});

// Main Memory Test Application
export const MemoryTestComponent = AirComponent('memory-test-component', function() {
  return () => html`
    <div>
      <h1>Controlled Memory Test Application</h1>
      <detachment-test-component></detachment-test-component>
      <state-retention-test></state-retention-test>
      <closure-event-test></closure-event-test>
      <global-state-test></global-state-test>
    </div>
  `;
});