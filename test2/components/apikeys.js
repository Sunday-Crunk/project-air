import { AirComponent, createState, html } from '../air-js/core/air.js';

export const ApiKeyPopup = AirComponent('api-key-popup', function() {
  const [apiKey, setApiKey] = createState('');
  const [refreshDate, setRefreshDate] = createState('');
  const [refreshDuration, setRefreshDuration] = createState(7);

  const requestApiKey = (duration) => {
    const expiryDate = new Date(Date.now() + duration * 86400 * 1000);
    return Curate.api.fetchCurate("/a/auth/token/impersonate", "POST", {
      "Label": "Manually generated Curate API Key, created by: " + pydio.user.id,
      "UserLogin": pydio.user.id,
      "AutoRefresh": duration * 86400 // Convert days to seconds
    }).then(r => {
      setApiKey(r.AccessToken);
      setRefreshDate(expiryDate.toLocaleDateString());
      return r;
    });
  };

  const generateApiKey = () => {
    requestApiKey(refreshDuration);
  };

  const copyApiKey = () => {
    const keyDisplay = document.createElement('textarea');
    keyDisplay.value = apiKey;
    document.body.appendChild(keyDisplay);
    keyDisplay.select();
    document.execCommand('copy');
    document.body.removeChild(keyDisplay);
    alert('API Key copied to clipboard!');
  };

  return html`
    <div class="modal-content">
      <h2>Generate a new API Key</h2>
      <p class="info-text">Generate a new API key by selecting the refresh duration and clicking the button below.</p>
      <div class="duration-container">
        <label for="duration-input">Key Refresh Duration (days):</label>
        <input type="number" id="duration-input" min="1" value="${refreshDuration}" oninput="${(e) => setRefreshDuration(parseInt(e.target.value))}">
      </div>
      <button class="generate-button" onclick="${generateApiKey}">Generate API Key</button>
      <div class="key-container">
        <input type="text" class="key-display" readonly value="${apiKey}" placeholder="Your API Key will appear here...">
        <button class="key-copy" onclick="${copyApiKey}"><i class="mdi mdi-content-copy"></i></button>
      </div>
      <p class="refresh-date">${refreshDate ? `This key will refresh on ${refreshDate} unless refreshed sooner, meaning its expiry is extended whenever it's used.` : ''}</p>
      <p class="safety-text"><strong>Important:</strong> Keep your API key secure. Do not share it, and ensure it is stored safely. Remember, you cannot retrieve it once this window is closed.</p>
    </div>

    <style>
      .modal-content {
        padding: 30px;
        text-align: center;
        margin: auto;
        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      }

      .info-text {
        margin-bottom: 20px;
        font-size: 16px;
        color: #333;
      }

      .duration-container {
        margin-bottom: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .duration-container label {
        margin-right: 10px;
        font-size: 14px;
        color: #333;
      }

      .duration-container input {
        padding: 8px 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
        width: 80px;
      }

      .generate-button {
        padding: 10px 20px;
        font-size: 16px;
        cursor: pointer;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 5px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        transition: background-color 0.3s;
      }

      .generate-button:hover {
        background-color: #45a049;
      }

      .key-container {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-top: 20px;
      }

      .key-display {
        flex-grow: 1;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
        font-size: 14px;
      }

      .key-copy {
        background-color: #007bff;
        border: none;
        padding: 8px 10px;
        cursor: pointer;
        border-radius: 5px;
        margin-left: 10px;
        color: white;
      }

      .refresh-date {
        margin-top: 20px;
        font-size: 14px;
        color: #555;
      }

      .safety-text {
        margin-top: 20px;
        font-size: 14px;
        color: #dc3545;
      }
    </style>
  `;
});