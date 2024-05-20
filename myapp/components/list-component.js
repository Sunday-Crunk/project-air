import { AirComponent, createState, onMount, onUnmount, html } from '../air-js/core/air.js';



export const ListComponent = AirComponent('list-component', function() {
  const [items, setItems] = createState([
    { id: 1, text: 'Item 1' },
    { id: 2, text: 'Item 2' },
    { id: 3, text: 'Item 3' },
  ]);
  const [count, setCount] = createState(1)
  const addItem = () => {
    const newItem = {
      id: items.length + 1,
      text: `Item ${items.length + 1}`,
    };
    setItems([...items(), newItem]);
  };

  const removeItem = (id) => {
    const updatedItems = items().filter((item) => item.id !== id);
    setItems(updatedItems);
  };

  onMount(() => {
    console.log('ListComponent mounted!');
  });

  onUnmount(() => {
    console.log('ListComponent unmounted!');
  });
  //in the component class before we call component.call we need to figue out nunber of layers
  return html`
    <div>
      <h1>List of Items</h1>
      <h1>Counter ${count} Again! ${count*2}</h1>
      <ul>
        ${items().map((item) => html`
          <li>
            ${item.text}
            <button onclick=${() => removeItem(item.id)}>Remove</button>
          </li>
        `)}
      </ul>
      <button onclick=${() => setCount(count()+1)}>Increase Counter!!!!!!</button>
      <button onclick=${addItem}>Add Item</button>
      
    </div>
  `;
});
