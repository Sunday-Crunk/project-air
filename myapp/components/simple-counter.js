import { AirComponent, createState, onMount, onUnmount, html } from '../air-js/core/air.js';

export const SimpleCounter = AirComponent('simple-counter', function() {
  const [count, setCount] = createState(1); // State for count
  const [differentCount, setDifferentCount] = createState(0); // State for count
  const [lang, setLang] = createState("en!")
  // Function to increment the count
  const d = count *2
  const incrementCount = () => {
    setCount(count() + 1);
    console.log("Incremented Count:", count());
  };
  const incrementDifferentCount = () => {
    setDifferentCount(differentCount() + 2);
    console.log("Incremented different dount:", differentCount());
  };
  // Function to decrement the count
  const decrementCount = () => {
    setCount(count() - 1);
    console.log("Decremented Count:", count());
  };

  onMount(() => {
    console.log('SimpleCounter mounted!');
  });

  onUnmount(() => {
    console.log('SimpleCounter unmounted!');
  });

  return html`
  <div>
    <h1>Count: ${count}</h1>
    <h1>Double: ${d}</h1>
    <h1>Different Count: ${differentCount}</h1>
    <button onclick="${incrementCount}">Increment</button>
    <button onclick="${decrementCount}">Decrement</button>
    <button onclick="${incrementDifferentCount}">Increment different count</button>
  </div>
`;

});
