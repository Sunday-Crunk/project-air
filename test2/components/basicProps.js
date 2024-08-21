import { AirComponent, createState, html, airCss } from '../air-js/core/air.js';

export const Display = AirComponent('display-component', function(props) {
  const computedValue = () => props.count * 2;
  return () => html`
    <p>Count: ${props.count}</p>
    <p>Doubled: ${computedValue()}</p>
  `;
});

export const MainComponent = AirComponent('counter-component', function() {
    const [count, setCount] = createState(0);
  
    return () => html`
      <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Counter App</h1>
      <display-component props=${{count}}></display-component>
      <button 
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onclick="${()=>setCount(count()+1)}">
        Increment
      </button>
    </div>
    `;
  });