import { AirComponent, createState, onMount, onUnmount, html} from '../air-js/core/air.js';

export const SuperSickDemo = AirComponent('super-sick-demo', function() {
  const [count, setCount] = createState(0);
  const [differentCount, setDifferentCount] = createState(0);
  const [message, setMessage] = createState('Hello, Air.js!');
  const [bgColor, setBgColor] = createState('#ffffff');
  const [lang, setLang] = createState("eng!")
  const [displayV, setDisplayV] = createState("block")
  console.log("diplodocus")
  const incrementCount = () => {
    setCount(count() + 1)
    console.log("count: ",count())
  };
  const incrementDifferentCount = () => {
    setDifferentCount(differentCount() + 2)
    console.log("different count: ",differentCount())
  };
  const decrementCount = () => setCount(count() - 1);

  const changeMessage = (event) => {
    setMessage(event.target.value);
  };
  const remove = count.onUpdate(e=>{console.log("count update hook");remove()})
  const difRemove = differentCount.onUpdate(e=>{console.log("different count update hook");remove()})
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const changeBackgroundColor = () => {
    const c = getRandomColor()
    console.log("color: ", c)
    setBgColor(c);
  };

  onMount(() => {
    console.log('SuperSickDemo mounted!');
    // Simulate fetching data from an API
    setTimeout(() => {
      setMessage('Data fetched successfully!');
    }, 2000);
  });

  onUnmount(() => {
    console.log('SuperSickDemo unmounted!');
    // Perform cleanup or unsubscribe from events if needed
  });

  return html`
  <div title=${bgColor} lang=${lang} style="background-color:${bgColor}; padding:${count}px; color:red; display:${displayV};">
    <h1>${message}</h1>
    <p>Count: ${count}</p>
    <p>Different Count: ${differentCount}</p>
    <button onclick=${incrementCount}>Increment</button>
    <button onclick=${decrementCount}>Decrement</button>
    <button onclick=${incrementDifferentCount}>Increment Different</button>
    <br /><br />
    <input type="text" value=${message} oninput=${changeMessage} />
    <br /><br />
    <button onclick=${changeBackgroundColor}>Change Background Color</button>
  </div>
`;

});