import { AirComponent, createState, html, airCss } from '../air-js/core/air.js';
import { PerformanceTest } from './components/rendertest.js';
import { QuantumRealmExplorer } from './components/quantumReal.js';
import { NotesApp } from './components/luxeNotes.js';
import { MemoryTestComponent } from './components/memorytest.js';
import { BasicComponent } from './components/basicComponentTemplate.js';
//import { AdvancedRoutingTest } from './components/advancedRouting.js';
// Main App Component
export const {App} = AirComponent('app-component', function() {
  
  return html`
  <notes-app></notes-app>
  `;
});
