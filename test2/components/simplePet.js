import { AirComponent, createState, html, airCss } from '../air-js/core/air.js';

// Display component
const Display = AirComponent('display-pet-component', function(props) {
  return () => html`
    <div>
      <p>Count: ${props.count()}</p>
      <p>Pets Adopted: ${() => Object.values(props.adoptedPets()).filter(Boolean).length}</p>
    </div>
  `;
});

// AdoptionControl component
const AdoptionControl = AirComponent('adoption-control', function(props) {
  return () => html`
    <button onclick="${() => props.onToggleAdoption(props.petId)}">
      ${() => props.adoptedPets()[props.petId] ? 'Unadopt Pet' : 'Adopt Pet'} ${props.petId}
    </button>
  `;
});

// Main component
export const MainComponent = AirComponent('counter-pet-component', function() {
  const [count, setCount] = createState(0);
  const [adoptedPets, setAdoptedPets] = createState({});

  const handleToggleAdoption = (petId) => {
    setAdoptedPets(prev => {
      const newState = { ...prev, [petId]: !prev[petId] };
      console.log("New adoptedPets state:", newState);
      return newState;
    });
  };

  adoptedPets.onUpdate(() => console.log("adoptedPets updated:", adoptedPets()));

  return () => html`
    <div>
      <h1>Counter and Pet Adoption</h1>
      <display-pet-component props=${{count: count, adoptedPets: adoptedPets}}></display-pet-component>
      <button onclick="${() => setCount(count() + 1)}">
        Increment
      </button>
      <adoption-control props=${{
        petId: 1,
        adoptedPets: adoptedPets,
        onToggleAdoption: handleToggleAdoption
      }}></adoption-control>
      <adoption-control props=${{
        petId: 2,
        adoptedPets: adoptedPets,
        onToggleAdoption: handleToggleAdoption
      }}></adoption-control>
    </div>
  `;
});