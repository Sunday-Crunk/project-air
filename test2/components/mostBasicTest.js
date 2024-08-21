import { AirComponent, createState, html, airCss } from '../air-js/core/air.js';

export const BasicComponent = AirComponent('most-basic-component', function() {
  const [state, setState] = createState(0);
  const doubledState = () => state * 2;
  return ()=> {
    const doub = state * 2;
   return html`
    <div style="position: relative;">
      <h1>Hello World</h1>
      <p>This is a basic component</p>
      <p>The value is: ${state}</p>
      <p>The value is: ${doubledState}</p>
      <p>The value is: ${doub}</p>
      <button onclick="${() => {setState(state + 1)}}">Increment</button>
    </div>
  `;}
});