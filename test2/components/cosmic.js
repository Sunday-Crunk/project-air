import { AirComponent, createState, html, airCss } from '../air-js/core/air.js'

const generateId = () => Math.random().toString(36).substr(2, 9);

AirComponent('cosmic-pet', (props) => {
  const [adopted, setAdopted] = createState(false);
  const styles = {
    container: airCss({
      backgroundColor: '#1a1a2e',
      borderRadius: '15px',
      padding: '20px',
      margin: '10px',
      color: '#fff',
      textAlign: 'center',
      transition: 'transform 0.3s',
      cursor: 'pointer',
      __hover: {
        transform: 'scale(1.05)'
      }
    }),
    image: airCss({
      width: '100px',
      height: '100px',
      borderRadius: '50%',
      margin: '10px auto',
      display: 'block'
    }),
    button: airCss({
      backgroundColor: () => adopted() ? '#4CAF50' : '#ff6b6b',
      color: '#fff',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '5px',
      cursor: 'pointer',
      transition: 'background-color 0.3s'
    })
  };

  return () => html`
    <div style="${styles.container}">
      <img src="${props.image}" alt="${props.name}" style="${styles.image}">
      <h3>${props.name}</h3>
      <p>${props.species} from ${props.planet}</p>
      <button style="${styles.button}" onclick="${() => {
        setAdopted(!adopted());
        props.onAdopt(props.id, adopted()); // try in template to see if we can force a rerender when function runs if the function is from props
      }}">
        ${() => adopted() ? 'Cancel Adoption' : 'Adopt Me!'}
      </button>
    </div>
  `;
});

AirComponent('adoption-stats', (props) => {
  console.log("AdoptionStats rendering, adoptedPets:", props.adoptedPets());
  const [count, setCount] = createState(0)
  const styles = {
    container: airCss({
      backgroundColor: '#34495e',
      color: '#ecf0f1',
      padding: '20px',
      borderRadius: '10px',
      margin: '20px 0',
      textAlign: 'center'
    }),
    stat: airCss({
      fontSize: '24px',
      margin: '10px 0'
    })
  };
  console.log("props: ", props)

  return () => html`
    <div style="${styles.container}">
      <h2>Adoption Statistics: ${count}</h2>
      <p style="${styles.stat}">Total Pets: ${props.totalPets}</p>
      <p style="${styles.stat}">Adopted Pets: ${Object.values(props.adoptedPets()).filter(Boolean).length}</p>
      <button onclick="${() => {
        setCount(count()+1)
      }}"> Increase Counter</button>
    </div>
  `;
});
// GalacticBackground component
const GalacticBackground = AirComponent('galactic-background', function() {
  const [stars, setStars] = createState([]);

  const styles = {
    container: airCss({
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: '#000',
      overflow: 'hidden',
      zIndex: -1
    }),
    star: airCss({
      position: 'absolute',
      backgroundColor: '#fff',
      borderRadius: '50%',
      animation: 'twinkle 1s infinite alternate'
    })
  };

  const createStars = () => {
    const newStars = [];
    for (let i = 0; i < 10; i++) {
      newStars.push({
        id: generateId(),
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: `${Math.random() * 3 + 1}px`
      });
    }
    setStars(newStars);
  };

  this.setOnMount(() => {
    createStars();
    const intervalId = setInterval(createStars, 1000);
    return () => clearInterval(intervalId);
  });
  
  return () => html`
    <div style="${styles.container}">
      ${stars().map(star => html`
        <div key="${star.id}" style="${styles.star()}${
        airCss({
          left: star.left,
          top: star.top,
          width: star.size,
          height: star.size
        })}"></div>
      `)}
    </div>
  `;
});
AirComponent('cosmic-pet-adoption-center', () => {
  const [pets, setPets] = createState([
    { id: generateId(), name: 'Zorblax', species: 'Floofian', planet: 'Floof-9', image: '/api/placeholder/100/100' },
    { id: generateId(), name: 'Nebula', species: 'Stardust Cat', planet: 'Whisker Nova', image: '/api/placeholder/100/100' },
    { id: generateId(), name: 'Quasar', species: 'Gravity Dog', planet: 'Paw Pulsar', image: '/api/placeholder/100/100' },
    { id: generateId(), name: 'Galaxia', species: 'Comet Fish', planet: 'Aquarius Prime', image: '/api/placeholder/100/100' }
  ]);

  const [adoptedPets, setAdoptedPets] = createState({"fanny":false});
  adoptedPets.onUpdate(()=>console.log("adoptedPets: ", adoptedPets()))
  const handleAdoption = (id, isAdopted) => {
    setAdoptedPets({...adoptedPets(), [id]: isAdopted});
  };
  
  const styles = {
    container: airCss({
      fontFamily: "'Space Mono', monospace",
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: 'rgba(26, 26, 46, 0.8)',
      borderRadius: '20px',
      boxShadow: '0 0 20px rgba(255, 255, 255, 0.1)'
    }),
    title: airCss({
      color: '#fff',
      textAlign: 'center',
      fontSize: '36px',
      marginBottom: '20px',
      textShadow: '0 0 10px #00ffff'
    }),
    petGrid: airCss({
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '20px'
    })
  };

  return () => html`
    <div style="${styles.container}">
        <galactic-background></galactic-background>
      <h1 style="${styles.title}">🚀 Cosmic Pet Adoption Center 🌌</h1>
      <button onclick="${() => {
        setAdoptedPets({"fanny":false})
      }}">Cock Adoptions</button>
      <adoption-stats props=${{totalPets: pets.length,adoptedPets}}></adoption-stats>
      <div style="${styles.petGrid}">
        ${pets.map(pet => html`
          <cosmic-pet props=${{...pet, onAdopt: handleAdoption, adoptedPets: adoptedPets()}}></cosmic-pet>
        `)}
      </div>
    </div>
  `;
});