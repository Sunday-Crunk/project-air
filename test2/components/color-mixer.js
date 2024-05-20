import { AirComponent, createState, html, airCss } from '../air-js/core/air.js';

export const ColorMixer = AirComponent('color-mixer', function() {
  const [red, setRed] = createState(0);
  const [green, setGreen] = createState(0);
  const [blue, setBlue] = createState(0);

  const theme = {
    colors: {
      primary: '#4CAF50',
      secondary: '#FFC107',
      background: '#f9f9f9',
      font: '#333'
    },
    fontSize: '14pt',
    padding: '15px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
  };

  const computeColor = () => `rgb(${red}, ${green}, ${blue})`;

  const styles = {
    container: airCss({
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: theme.padding,
      border: `1px solid ${theme.colors.secondary}`,
      borderRadius: theme.borderRadius,
      backgroundColor: theme.colors.background,
      boxShadow: theme.boxShadow
    }),
    slider: airCss({
      margin: '10px 0',
      width: '100%'
    }),
    resultBox: airCss({
      width: '100px',
      height: '100px',
      backgroundColor: computeColor,
      marginTop: '20px',
      border: '1px solid #000'
    }),
    label: airCss({
      fontSize: theme.fontSize,
      color: theme.colors.font
    })
  };

  return () => html`
    <div style="${styles.container}">
      <h1>Color Mixer</h1>
      <label style="${styles.label}">Red: ${red}</label>
      <input type="range" min="0" max="255" value="${red}" oninput="${(e) => setRed(e.target.value)}" style="${styles.slider}">
      <label style="${styles.label}">Green: ${green}</label>
      <input type="range" min="0" max="255" value="${green}" oninput="${(e) => setGreen(e.target.value)}" style="${styles.slider}">
      <label style="${styles.label}">Blue: ${blue}</label>
      <input type="range" min="0" max="255" value="${blue}" oninput="${(e) => setBlue(e.target.value)}" style="${styles.slider}">
      <div style="${styles.resultBox}"></div>
    </div>
  `;
});
