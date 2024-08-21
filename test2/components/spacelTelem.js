import { AirComponent, createState, html, airCss } from '../air-js/core/air.js';

// Simulated space data API
const fetchSpaceData = () => new Promise((resolve) => {
  setTimeout(() => {
    resolve({
      shipStatus: {
        hull: 92,
        fuel: 78,
        oxygen: 95,
        crew: 98,
      },
      nearbyPlanets: [
        { name: "Kepler-186f", distance: 492, habitability: 89 },
        { name: "Proxima Centauri b", distance: 4.2, habitability: 82 },
        { name: "TRAPPIST-1e", distance: 39, habitability: 93 },
      ],
      anomalies: [
        { type: "Quantum Fluctuation", severity: "High", location: "Sector 7G" },
        { type: "Temporal Rift", severity: "Medium", location: "Nebula X9" },
      ],
    });
  }, 1500);
});

// Theme
const theme = {
  colors: {
    background: '#0a0e17',
    primary: '#00b4d8',
    secondary: '#7209b7',
    accent: '#f72585',
    text: '#e0e1dd',
    success: '#4caf50',
    warning: '#ff9800',
    danger: '#f44336',
  },
  fonts: {
    main: "'Arial', sans-serif",
    display: "'Helvetica', sans-serif",
  },
};

// Styles
const styles = {
  dashboard: airCss({
    fontFamily: theme.fonts.main,
    backgroundColor: theme.colors.background,
    color: theme.colors.text,
    minHeight: '100vh',
    padding: '20px',
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '20px',
    boxSizing: 'border-box',
  }),
  header: airCss({
    gridColumn: '1 / -1',
    fontFamily: theme.fonts.display,
    fontSize: '2.5em',
    textAlign: 'center',
    color: theme.colors.primary,
    marginBottom: '20px',
  }),
  panel: airCss({
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '10px',
    padding: '20px',
  }),
  panelTitle: airCss({
    fontFamily: theme.fonts.display,
    fontSize: '1.2em',
    color: theme.colors.primary,
    marginBottom: '15px',
  }),
  list: airCss({
    listStyle: 'none',
    padding: 0,
    margin: 0,
  }),
  listItem: airCss({
    padding: '10px 0',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  }),
};

// ProgressBar component
const ProgressBar = AirComponent('progress-bar', function({value, color}) {
  return () => html`
    <div style="${airCss({
      width: '100%',
      height: '8px',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '4px',
      overflow: 'hidden',
    })}">
      <div style="${airCss({
        width: `${value}%`,
        height: '100%',
        backgroundColor: theme.colors[color || 'primary'],
      })}"></div>
    </div>
  `;
});

// Main CosmosQuest component
export const CosmosQuest = AirComponent('cosmos-quest', function() {
  const [data, setData] = createState(null);
  const [loading, setLoading] = createState(true);

  this.setOnMount(() => {
    fetchSpaceData().then(fetchedData => {
      setData(fetchedData);
      setLoading(false);
    });
  });

  return () => {


    return html`
      ${loading() ? html`<div style="${styles.dashboard}"><h2>Initializing CosmosQuest systems...</h2></div>` : ""}
      ${!loading() ? html`
        <div style="${styles.dashboard}">
          <h1 style="${styles.header}">CosmosQuest Command Center</h1>
          
          <div style="${styles.panel}">
            <h2 style="${styles.panelTitle}">Ship Status</h2>
            <ul style="${styles.list}">
              ${Object.entries(data().shipStatus).map(([key, value]) => html`
                <li style="${styles.listItem}">
                  <div>${key}: ${value}%</div>
                  <progress-bar props=${{ value, color: value > 80 ? 'success' : value > 50 ? 'warning' : 'danger' }}></progress-bar>
                </li>
              `)}
            </ul>
          </div>
          
          <div style="${styles.panel}">
            <h2 style="${styles.panelTitle}">Nearby Planets</h2>
            <ul style="${styles.list}">
              ${data().nearbyPlanets.map(planet => html`
                <li style="${styles.listItem}">
                  <div>${planet.name}</div>
                  <div>Distance: ${planet.distance} light-years</div>
                  <div>Habitability: ${planet.habitability}%</div>
                </li>
              `)}
            </ul>
          </div>
          
          <div style="${styles.panel}">
            <h2 style="${styles.panelTitle}">Anomaly Alerts</h2>
            <ul style="${styles.list}">
              ${data().anomalies.map(anomaly => html`
                <li style="${styles.listItem}">
                  <div>Type: ${anomaly.type}</div>
                  <div>Severity: ${anomaly.severity}</div>
                  <div>Location: ${anomaly.location}</div>
                </li>
              `)}
            </ul>
          </div>
        </div>
      ` : ""}
    `;
  };
});