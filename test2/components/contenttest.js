import { AirComponent, createState, html, airCss } from '../air-js/core/air.js';

export const Container = AirComponent('container-component', function(props) {
  const [state, setState] = createState({});
  console.log("props container: ", props.children)
  return () => html`
    <div style="position: relative;">
    ${props.children} <!-- shows the inner component -->
    </div>
  `;
});
const Inner = AirComponent('inner-component', function(props) {
  const [state, setState] = createState(1);
  console.log("props inner: ", props.children)
  return () => html`
    <div style="position: relative;">
      <h1>Hello World</h1>
      <p>This is a paragraph</p>
      <button onclick="${() => setState(state + 1)}">Increment</button>
      <p>Count: ${state}</p>
      ${props.children} <!-- shows eggz and test span -->
    </div>
  `;
});
export const Page = AirComponent('page-component', function() {
    const [state, setState] = createState({});
  
    return () => html`
      <div style="position: relative;">
        <container-component>
          <inner-component>
            eggz
            <span>test</span>
          </inner-component>
        </container-component>
      </div>
    `;
  });