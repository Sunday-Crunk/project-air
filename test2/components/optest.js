import { AirComponent, createState, html } from '../air-js/core/air.js';

export const CoercionValidationTester = AirComponent('coercion-validation-tester', function() {
  const [testValue, setTestValue] = createState(null); // Use null to check falsy handling

  const tests = [
    { description: 'Direct proxy in logical operation', test: () => testValue ? "Fail" : "Pass" },
    { description: 'Invoked value in logical operation', test: () => testValue() ? "Fail" : "Pass" },
    { description: 'Direct proxy in equality check (== null)', test: () => testValue == null ? "Fail" : "Pass" },
    { description: 'Invoked value in equality check (== null)', test: () => testValue() == null ? "Pass" : "Fail" },
    { description: 'Direct proxy in arithmetic operation (+ 1)', test: () => typeof (testValue + 1) === "number" ? "Pass" : "Fail" },
    { description: 'Invoked value in arithmetic operation (+ 1)', test: () => typeof (testValue() + 1) === "number" ? "Pass" : "Fail" },
  ];

  return () => html`
    <div>
      <h1>State Proxy Usage Validation Tests</h1>
      <ul>
        ${tests.map(test => html`
          <li>${test.description}: ${test.test()}</li>
        `)}
      </ul>
    </div>
  `;
});
