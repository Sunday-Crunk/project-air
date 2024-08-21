import { AirComponent, createState, html, airCss, onMount } from '../air-js/core/air.js';

export const SlowLoadingComponent = AirComponent('slow-loading-component', function() {
  const [isLoading, setIsLoading] = createState(true);
  const [data, setData] = createState(null);

  const simulateSlowLoad = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          message: "Data successfully loaded!",
          timestamp: new Date().toLocaleString()
        });
      }, 3000); // Simulates a 3-second load time
    });
  };

  onMount(() => {
    simulateSlowLoad().then((result) => {
      setData(result);
      setIsLoading(false);
    });
  });

  const containerStyle = airCss({
    fontFamily: 'Arial, sans-serif',
    maxWidth: '400px',
    margin: '20px auto',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#ffffff',
    textAlign: 'center'
  });

  const loadingStyle = airCss({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '200px',
    fontSize: '18px',
    color: '#666666'
  });

  const contentStyle = airCss({
    marginTop: '20px'
  });

  return () => html`
    <div style="${containerStyle()}">
      <h2>Slow Loading Component</h2>
      ${isLoading() 
        ? html`
          <div style="${loadingStyle()}">
            <p>Loading... Please wait.</p>
          </div>
        ` 
        : html`
          <div style="${contentStyle()}">
            <p>${data().message}</p>
            <p>Loaded at: ${data().timestamp}</p>
          </div>
        `
      }
    </div>
  `;
});