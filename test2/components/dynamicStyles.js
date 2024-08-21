import { AirComponent, createState, html, airCss } from '../air-js/core/air.js';

export const DynamicStyles = AirComponent('basic-component', function() {
  const [state, setState] = createState({});
  const [hover, setHover] = createState(false);
  const style = airCss({
    backgroundColor:  ()=> hover() ? 'red' : 'white'
  });
  return () => html`
    <div style="position: relative;">
        <button onmouseover="${()=>setHover(true)}" onmouseout="${()=>setHover(false)}" style="${style()}">Hover</button>
    </div>
  `;
});