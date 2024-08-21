import { AirComponent, createState, html, airCss, onMount} from '../air-js/core/air.js';

export const BasicComponent = AirComponent('mount-component', function() {
  console.log("dogwater: ", this.innerHTML)
  const [state, setState] = createState(0);
    onMount(() => {
        console.log("mounted: ", this.innerHTML)
    });
  return () => html`
    <div style="position: relative;">
    hi
    <p>count: ${state()}</p>
    <button onclick="${() => {setState(state+1)}}">Click me</button>
    </div>
  `;
});