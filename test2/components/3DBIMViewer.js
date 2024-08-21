import { AirComponent, createState, html, airCss } from '../air-js/core/air.js';

export const BimViewer = AirComponent('bim-viewer', function() {
  const [state, setState] = createState({});

  return () => html`
    <div style="position: relative;">
    </div>
  `;
});
