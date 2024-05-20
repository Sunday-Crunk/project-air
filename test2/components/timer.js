import { AirComponent, createState,html } from '../air-js/core/air.js';

export const TimerComponent = AirComponent('timer-component', function() {
  const [seconds, setSeconds] = createState(60); // State for timer in seconds
  // Initially, the timer should be inactive; hence 'disabled' is empty to enable the 'Start' button
  const [isActive, setIsActive] = createState("");

  // Function to decrement the timer
  const decrementTimer = () => {
    if (seconds() > 0 && isActive() === "") {
      setTimeout(() => {
        console.log("decrem")
        setSeconds(seconds - 1);
        decrementTimer();
      }, 1000);
    } else {
      setIsActive("disabled"); // Automatically add 'disabled' when countdown reaches 0 or is manually stopped
    }
  };

  // Start the timer
  const startTimer = () => {
    console.log("biioio: ", isActive())
    //if (isActive() == "disabled") {
      setIsActive(""); // Clear the 'disabled' state to enable the button
      console.log("dog")
      decrementTimer();
    //}
  };

  // Stop the timer
  const stopTimer = () => {
    setIsActive("disabled");
  };

  // Reset the timer
  const resetTimer = () => {
    setSeconds(60);
    setIsActive("disabled");
  };

  // Set a specific duration for the timer
  const setDuration = (newDuration) => {
    setSeconds(newDuration);
  };


  return ()=>html`
  <div>
    <h1>Timer: ${seconds()} Seconds</h1>
    <button onclick="${startTimer}" ${isActive()}>Start</button>
    <button onclick="${stopTimer}" ${isActive() === "" ? "disabled" : ""}>Stop</button>
    <button onclick="${resetTimer}">Reset</button>
    <input type="number" min="1" oninput="${(e) => setDuration(parseInt(e.target.value))}" placeholder="Set duration (sec)">
  </div>
  `;
});
//the framework doesnt know how to handle this slightly odd case of ternary definition of a unary attribute like "disabled", we can either move to the react model of a standard = attribute format, or we can try and 
// support unary/boolean attributes. I want to support boolean attributes with vanilla syntax to align with my framework goals. On further thinking it occurs that i originally intended to keep logic in the javascript
// which is the spirit of html and js. SO in that case is the result here the expected one? You cant evaluate stateful logic inside tags, only resolve states to values, so the button tags here just resolve on initial
// render to not disabled and disabled, but dont change when the buttons are clicked. 
// With this in mind, we've got principaled decisions to make, should we enforce no stateful logic inside the html in the spirit of html? or do we allow it for "convenience"? either way, I quite like the pure method, 
// though undoubtedly being able to do ternaries and logical operations physically within the value tag would be useful. It's a little difficult to imagine all the things that would implicate though, epsecially looking
// forwards at function definitions in non handler attributes (inline function defs work perfectly fine in event handlers, just havent test elsewhere). A big reason for sticking to onnly "vanilla" syntax is simplicity/transferrability
// sure you can skate through in react not needing to know a lot of the weird differences between jsx and pure html/js like we do here, but it still catches you out. For example disabled=true isnt valid html, im
// given to understand that works in jsx. Because all conventions of html then apply we dont have to document it, it's just business as usual. and everyone knows what they're doing
// implicitly. It's important to note we cant achieve stateful boolean attribuutes right now, we're not mapping booleans, we do need to do that anyway. 


// hmmmmmmmmm, framework treats aState() and aState in the html differently, I think it's maybe a good thing as aState refers to the function itself and aState() refers to the value, so if you do aState() you must be
// looking specifically for the frozen value? is that what we call it, freezing it? So you can do aState() to evaluate the value of the function once at render time, and not recieve any updates, or you can do
// aState to refer to the stateFul value that will change on state update. There could be some cool things you could do with that. I dont know how this fits together with the thoughts above ahhhhh ok frameworkl does
// not catch the booleans so doing just aState as a boolean breaks it completely, if you do aState() it at least resolves before render so it still gets a value, just frozen. In that case, frozen values! Now supported!
