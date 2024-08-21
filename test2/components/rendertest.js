import { AirComponent, createState, html, airCss, onMount } from '../air-js/core/air.js';

export const PerformanceTest = AirComponent('performance-test', function() {
  const [items, setItems] = createState([]);
  const [renderCount, setRenderCount] = createState(0);
  const [renderTime, setRenderTime] = createState(0);

  const addItems = () => {
    const startTime = performance.now();
    const newItems = Array.from({ length: 1000 }, (_, index) => ({
      id: Date.now() + index,
      value: Math.random()
    }));
    setItems([...items(), ...newItems]);
    const endTime = performance.now();
    setRenderTime(endTime - startTime);
    setRenderCount(renderCount() + 1);
  };

  onMount(() => {
    const intervalId = setInterval(addItems, 1000);
    return () => clearInterval(intervalId);
  });

  const styles = {
    container: airCss({
      fontFamily: 'Arial, sans-serif',
      padding: '16px',
      backgroundColor: '#f0f0f0',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }),
    title: airCss({
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '16px'
    }),
    stats: airCss({
      marginBottom: '16px'
    }),
    statLine: airCss({
      marginBottom: '8px'
    }),
    list: airCss({
      height: '400px',
      overflowY: 'auto',
      border: '1px solid #ccc',
      borderRadius: '4px',
      padding: '8px',
      backgroundColor: 'white'
    }),
    listItem: airCss({
      marginBottom: '4px'
    })
  };

  return () => html`
    <div style="${styles.container()}">
      <h1 style="${styles.title()}">AirJS Rendering Performance Test</h1>
      <div style="${styles.stats}">
        <p style="${styles.statLine()}">Total Items: ${items().length}</p>
        <p style="${styles.statLine()}">Render Count: ${renderCount}</p>
        <p style="${styles.statLine()}">Last Render Time: ${renderTime().toFixed(2)} ms</p>
      </div>
      <ul style="${styles.list()}">
        ${items().map(item => html`
          <li key="${item.id}" style="${styles.listItem()}">${item.value.toFixed(4)}</li>
        `)}
      </ul>
    </div>
  `;
});