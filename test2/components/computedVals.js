import { AirComponent, createState, html, airCss } from '../air-js/core/air.js';

export const BasicComponent = AirComponent('basic-component', function() {
  const [count, setCount] = createState(0); // count state updates when button is clicked'
  const count2 = count * 2; // computed doubled value does not update when button is clicked
  const funcCount = () => count * 2; // computed function value updates when button is clicked
  return () => html`
    <div style="position: relative;">
      <p>Count: ${count}</p>
      <p>Doubled Count: ${count2}</p> 
      <p>Function Count: ${funcCount()}</p> 
      <p>Direct Count: ${count * 2}</p> <!-- direct multiple updates when button is clicked-->
      <button onclick="${() => setCount(count + 1)}">Increment</button>
    </div>
  `;
});