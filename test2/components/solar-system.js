import { AirComponent, createState, html, airCss} from '../air-js/core/air.js';

export const SolarSystemExplorer = AirComponent('solar-system-explorer', function() {
  const [selectedPlanet, setSelectedPlanet] = createState(null);
  const theme = {
    colors: {
      primary: 'blue',
      secondary: 'grey'
    },
    fontSize: '12pt',
    background: {
      color: 'red'
    }
  };
  
  const { colors: { primary, secondary }, fontSize, background } = theme;
  const [backgroundColor, setBackgroundColor] = createState("pink")
  selectedPlanet.onUpdate((e)=>{console.log("set planet to: ", selectedPlanet.read)})
  const [eggColor, setEggColor] = createState("pink")
  const styles = airCss({
    background: {
      ...background,
      color: eggColor // Overriding color from background group in the theme, with a stateful variable!
    },
    font: {
      size: fontSize,
      color: "green"
    },
    padding: {
        left: "10px",
        right: "20px"
    },
    opacity:0.4
  });
  const planets = {
    Mercury: { mass: '3.30 × 10^23 kg', distance: '57.91 million km', features: 'Mercury is the smallest and fastest planet in the Solar System.' },
    Venus: { mass: '4.87 × 10^24 kg', distance: '108.2 million km', features: 'Venus has a thick atmosphere full of the greenhouse gas carbon dioxide and clouds of sulfuric acid.' },
    Earth: { mass: '5.97 × 10^24 kg', distance: '149.6 million km', features: 'Earth is the only planet known to support life.' },
    Mars: { mass: '6.39 × 10^23 kg', distance: '227.9 million km', features: 'Mars hosts the tallest volcano and the deepest, longest valley in the Solar System.' },
    Jupiter: { mass: '1.90 × 10^27 kg', distance: '778.5 million km', features: 'Jupiter is the largest planet and is famous for its Great Red Spot.' },
    Saturn: { mass: '5.68 × 10^26 kg', distance: '1.434 billion km', features: 'Saturn is well known for its extensive ring system.' },
    Uranus: { mass: '8.68 × 10^25 kg', distance: '2.871 billion km', features: 'Uranus rotates on its side, making it unique among the planets.' },
    Neptune: { mass: '1.02 × 10^26 kg', distance: '4.495 billion km', features: 'Neptune is known for its strong winds, sometimes reaching speeds over 2,000 km/h.' }
  };    
  return ()=>html`
    <div class="solar-system-explorer" style="${styles}">
      <h1 class="title">Solar System Explorer</h1>
      <select onchange="${(e) => {setSelectedPlanet(planets[e.target.value]);console.log("set planet to: ", selectedPlanet());setEggColor(selectedPlanet().features)}}">
        <option value="">Select a Planet</option>
        ${Object.keys(planets).map(planet => html`<option value="${planet}">${planet}</option>`)}
      </select>
      ${selectedPlanet() ? 'Yep' : 'Nope'}
      <div class="planet-info">
        ${selectedPlanet() ? html`
          <h2>${'Selected Planet: ' + Object.keys(planets).find(key => planets[key] === selectedPlanet())}</h2>
          <p><strong>Mass:</strong> ${selectedPlanet().mass}</p>
          <p><strong>Distance from Sun:</strong> ${selectedPlanet().distance}</p>
          <p><strong>Notable Features:</strong> ${selectedPlanet().features}</p>
        ` : 'Select a planet to see its information.'}
      </div>
    </div>
    <style>
      .solar-system-explorer {
        max-width: 600px;
        margin: 20px auto;
        padding: 20px;
        background-color: #f0f0f0;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }

      .title {
        text-align: center;
        color: #333;
        font-size: 24px;
        margin-bottom: 20px;
      }

      select {
        width: 100%;
        padding: 10px;
        border-radius: 5px;
        font-size: 16px;
      }

      .planet-info {
        margin-top: 20px;
        font-size: 16px;
        color: #555;
      }
    </style>
  `;
});
