import { AirComponent, createState, html, airCss } from '../air-js/core/air.js';

const ItemWithState = AirComponent('item-with-state', function(props) {
  const [count, setCount] = createState(0);
  console.log("props: ", props)
  const itemStyle = airCss({
    margin: '5px',
    padding: '5px',
    border: '1px solid black'
  });

  return () => html`
    <div style="${itemStyle()}">
      ${props.item} - Count: ${count()}
      <button onclick="${() => setCount(count() + 1)}">Increment</button>
    </div>
  `;
});

export const KeyDemonstration = AirComponent('key-demonstration', function() {
  const [items, setItems] = createState(['A', 'B', 'C']);

  const addItem = () => {
    setItems([...items(), items().length.toString()]);
  };

  const removeItem = () => {
    setItems(items().slice(0, -1));
  };

  const shuffleItems = () => {
    setItems([...items()].sort(() => Math.random() - 0.5));
  };

  const containerStyle = airCss({
    display: 'flex',
    flexDirection: 'column',
    marginTop: '10px'
  });

  return () => html`
    <div>
      <button onclick="${addItem}">Add Item</button>
      <button onclick="${removeItem}">Remove Item</button>
      <button onclick="${shuffleItems}">Shuffle Items</button>
      <item-with-state props=${{ item: items()[0] }}></item-with-state>
      <div style="${containerStyle()}">
        ${items().map(item => html`
          <item-with-state props=${{ item }}></item-with-state>
        `)}
      </div>
    </div>
  `;
});