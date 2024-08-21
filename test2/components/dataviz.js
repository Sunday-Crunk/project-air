import { AirComponent, createState, html, airCss } from '../air-js/core/air.js';

export const DataVizMaster3000 = AirComponent('data-viz-master-3000', function() {
  // State management
  const [data, setData] = createState(generateMockData());
  const [selectedMetric, setSelectedMetric] = createState('revenue');
  const [timeRange, setTimeRange] = createState('1M');
  const [theme, setTheme] = createState('light');
  const [animationSpeed, setAnimationSpeed] = createState(300);

  // Mock data generation
  function generateMockData() {
    const startDate = new Date(new Date().setFullYear(new Date().getFullYear() - 1));
    return Array.from({ length: 365 }, (_, i) => {
      const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
      return {
        date: date.toISOString().split('T')[0],
        revenue: Math.random() * 10000 + 5000,
        users: Math.floor(Math.random() * 1000 + 500),
        engagement: Math.random() * 100
      };
    });
  }

  // Computed values
  const computedData = () => {
    const filtered = data().filter(item => {
      const date = new Date(item.date);
      const now = new Date();
      switch(timeRange()) {
        case '1M': return date >= new Date(now.setMonth(now.getMonth() - 1));
        case '3M': return date >= new Date(now.setMonth(now.getMonth() - 3));
        case '6M': return date >= new Date(now.setMonth(now.getMonth() - 6));
        case '1Y': return date >= new Date(now.setFullYear(now.getFullYear() - 1));
        default: return true;
      }
    });
    return filtered.map(item => ({
      date: item.date,
      value: item[selectedMetric()]
    }));
  };

  // Styles
  const styles = {
    container: airCss({
      display: 'flex',
      flexDirection: 'column',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      maxWidth: '1200px',
      margin: '0 auto',
      backgroundColor: () => theme() === 'dark' ? '#1a1a1a' : '#ffffff',
      color: () => theme() === 'dark' ? '#ffffff' : '#333333',
      transition: 'background-color 0.3s, color 0.3s',
    }),
    header: airCss({
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
    }),
    title: airCss({
      fontSize: '24px',
      fontWeight: 'bold',
    }),
    controls: airCss({
      display: 'flex',
      gap: '10px',
    }),
    select: airCss({
      padding: '5px 10px',
      borderRadius: '5px',
      border: '1px solid #ccc',
      backgroundColor: () => theme() === 'dark' ? '#333' : '#fff',
      color: () => theme() === 'dark' ? '#fff' : '#333',
    }),
    chart: airCss({
      height: '400px',
      marginBottom: '20px',
      backgroundColor: () => theme() === 'dark' ? '#2a2a2a' : '#f0f0f0',
      borderRadius: '10px',
      padding: '20px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    }),
  };

  // Chart rendering function
  const renderChart = () => {
    const chartData = computedData();
    const maxValue = Math.max(...chartData.map(d => d.value));
    const minValue = Math.min(...chartData.map(d => d.value));
    const range = maxValue - minValue;
    
    return html`
      <svg width="100%" height="100%" viewBox="0 0 1000 400">
        ${chartData.map((item, index) => {
          const x = (index / (chartData.length - 1)) * 1000;
          const y = 400 - ((item.value - minValue) / range) * 380;
          return html`
            <circle
              cx="${x}"
              cy="${y}"
              r="4"
              fill="${theme() === 'dark' ? '#61dafb' : '#3498db'}"
              opacity="0"
            >
              <animate
                attributeName="opacity"
                from="0"
                to="1"
                dur="${animationSpeed()}ms"
                begin="${index * (animationSpeed() / chartData.length)}ms"
                fill="freeze"
              />
            </circle>
            ${index < chartData.length - 1 ? html`
              <line
                x1="${x}"
                y1="${y}"
                x2="${(index + 1) / (chartData.length - 1) * 1000}"
                y2="${400 - ((chartData[index + 1].value - minValue) / range) * 380}"
                stroke="${theme() === 'dark' ? '#61dafb' : '#3498db'}"
                stroke-width="2"
                opacity="0"
              >
                <animate
                  attributeName="opacity"
                  from="0"
                  to="1"
                  dur="${animationSpeed()}ms"
                  begin="${index * (animationSpeed() / chartData.length)}ms"
                  fill="freeze"
                />
              </line>
            ` : ''}
          `;
        })}
      </svg>
    `;
  };

  // Main render function
  return () => html`
    <div style="${styles.container}">
      <div style="${styles.header}">
        <h1 style="${styles.title}">DataVizMaster3000</h1>
        <div style="${styles.controls}">
          <select style="${styles.select}" onchange="${e => setSelectedMetric(e.target.value)}">
            <option value="revenue">Revenue</option>
            <option value="users">Users</option>
            <option value="engagement">Engagement</option>
          </select>
          <select style="${styles.select}" onchange="${e => setTimeRange(e.target.value)}">
            <option value="1M">1 Month</option>
            <option value="3M">3 Months</option>
            <option value="6M">6 Months</option>
            <option value="1Y">1 Year</option>
          </select>
          <select style="${styles.select}" onchange="${e => setTheme(e.target.value)}">
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
          <input
            type="range"
            min="100"
            max="1000"
            step="100"
            value="${animationSpeed}"
            onchange="${e => setAnimationSpeed(Number(e.target.value))}"
          />
        </div>
      </div>
      <div style="${styles.chart}">
        ${renderChart()}
      </div>
    </div>
  `;
});