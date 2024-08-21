import { AirComponent, createState, html, airCss } from '../air-js/core/air.js';

export const BasicComponent = AirComponent('basic-component', function() {
  const [state, setState] = createState(0);

  return () => html`
    <div style="position: relative;">
      <h1>Hello, world!</h1>
      <p>This is a basic component.</p>
      <button onclick="${() => setState(s => s + 1)}">Increment</button>
      <p>Count: ${state}</p>
    </div>
  `;
});