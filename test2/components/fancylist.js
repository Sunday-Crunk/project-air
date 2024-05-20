import { AirComponent, createState, html } from '../air-js/core/air.js';

export const FancyListComponent = AirComponent('fancy-list-component', function() {
  const [items, setItems] = createState([
    { id: 1, text: 'Take a walk in the park' },
    { id: 2, text: 'Read a book' },
    { id: 3, text: 'Learn a new skill' },
  ]);

  const [inputText, setInputText] = createState('');

  const addItem = () => {
    if (inputText.trim() !== '') {
      console.log("adding new card: ", inputText.read)
      const newItem = {
        id: Date.now(),
        text: inputText.read,
      };
      setItems([...items(), newItem]);
      
    }
  };

  const removeItem = (id) => {
    const updatedItems = items().filter((item) => item.id !== id);
    setItems(updatedItems);
  };
  const [color, setColor] = createState("#f")
  return ()=>html`
    <div class="fancy-list" style="${"background-color:blue;"}color:${color()};">
      <h1 class="title">My Fabulous To-Do List</h1>
      <div class="input-container">
        <input
          type="text"
          placeholder="Enter a new task..."
          value="${inputText()}"
          oninput="${(e) => {setColor("#"+e.target.value);setInputText(e.target.value)}}"
        />
        <button class="add-button" onclick="${addItem}">Add</button>
      </div>
      <ul class="item-list">
        ${items().map(
          (item) => html`
            <li class="item">
              <span class="item-text">${item.text}</span>
              <button class="remove-button" onclick="${() => removeItem(item.id)}">
                &times;
              </button>
            </li>
          `
        )}
      </ul>
    </div>
    <style>
      .fancy-list {
        max-width: 400px;
        margin: 0 auto;
        padding: 20px;
        background-color: #f4f4f4;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .title {
        text-align: center;
        color: #333;
        font-size: 24px;
        margin-bottom: 20px;
      }

      .input-container {
        display: flex;
        margin-bottom: 10px;
      }

      input[type='text'] {
        flex: 1;
        padding: 8px;
        font-size: 16px;
        border: none;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .add-button {
        padding: 8px 16px;
        font-size: 16px;
        background-color: #007bff;
        color: #fff;
        border: none;
        border-radius: 4px;
        margin-left: 10px;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }

      .add-button:hover {
        background-color: #0056b3;
      }

      .item-list {
        list-style-type: none;
        padding: 0;
      }

      .item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px;
        background-color: #fff;
        border-radius: 4px;
        margin-bottom: 10px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        animation: fadeIn 0.5s ease;
      }

      .item-text {
        flex: 1;
        font-size: 18px;
        color: #333;
      }

      .remove-button {
        background-color: transparent;
        border: none;
        color: #dc3545;
        font-size: 20px;
        cursor: pointer;
        transition: color 0.3s ease;
      }

      .remove-button:hover {
        color: #a71d2a;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    </style>
  `;
});