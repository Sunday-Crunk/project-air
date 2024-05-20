import { AirComponent, createState, html} from '../air-js/core/air.js';
export const ListComponent = AirComponent('list-component', function() {
  const [items, setItems] = createState([
    { id: 1, text: 'Item 1' },
    { id: 2, text: 'Item 2' },
    { id: 3, text: 'Item 3' },
  ]);

  const [count, setCount] = createState(1);

  const addItem = () => {
    console.log("items before adding: ", items.read)
    const newItem = {
      id: items.length + 1,
      text: `Item ${items.length + 1}`,
    };
    const v = items
    setItems([...items, newItem]);
    console.log("items after adding: ", items.read)
  };

  const removeItem = (id) => {
    const updatedItems = items.filter((item) => item.id !== id);
    setItems(updatedItems);
  };
  const double = () => count *2
  const incrementCount = () => {
    setCount(count + 1)
    console.log("count: ",count)
  };

  this.onMount = (() => {
    console.log('ListComponent mounted!');
  });

  this.onUnmount = (() => {
    console.log('ListComponent unmounted!');
  });
  //detect when a signal value say "count" is used in a computational way
  return html`
    <div>
      <h1>List of Items</h1>
      <h1>Counter ${count} Again! ${()=>count*2}</h1> 
      <ul>
      
        ${items.map(item => html`
          <li>
            ${item.text}
            <button onclick="${() => removeItem(item.id)}">Remove</button>
          </li>
        `)}
      </ul>
      <button onclick="${incrementCount}">Increase Counter!!!!!!</button>
      <button onclick="${addItem}">Add Item</button>
    </div>
  `;
});