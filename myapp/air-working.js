// air.js
const elementRegistry = new Map();
const stateMap = new WeakMap();
const attributeMap = new Map();
const styleMap = new Map();
let currentComponent = null;

export const AirComponent = (elementName, component) => {
  if (elementRegistry.has(elementName)) throw new Error(`Custom element '${elementName}' already defined.`);
  elementRegistry.set(elementName, component);

  class CustomElement extends HTMLElement {
    constructor() {
        super();
        currentComponent = this;
        this.componentId = `custom_${Math.random().toString(36).slice(2, 15)}`;
        this.eventHandlers = new Map();
        this.stateHandlers = new Map();
        this.stateSubscriptions = [];
      }

      connectedCallback() {
        
        this.render();
        this.setupStateSubscriptions();
      }
      disconnectedCallback() {
        this.teardownStateSubscriptions(); // Cleanup subscriptions on unmount
      }
      setupStateSubscriptions() {
        console.log(this.stateHandlers)
        this.stateHandlers.forEach((stateObj, id) => {
          const { subscribe, getValue } = stateObj;
          const subscription = subscribe(() => {console.log("published sub for value: ", getValue());this.updateStateValues(); this.updateSubscribers(getValue())});
          this.stateSubscriptions.push(subscription);
        });
        console.log(this.stateSubscriptions)
      }
      updateSubscribers(value){

      }
    
      teardownStateSubscriptions() {
        this.stateSubscriptions.forEach(unsubscribe => unsubscribe());
        this.stateSubscriptions = [];
      }
    render() {
      
      const newContent = component.call(this);
      this.innerHTML = '';
      
      this.appendChild(document.importNode(newContent.content, true));
      this.attachEventListeners();
      this.updateStateValues();
    }

    attachEventListeners() {
      this.querySelectorAll('*').forEach(el => {
        Array.from(el.attributes).forEach(attr => {
          const match = attr.value.match(/^placeholder-for-event-(\d+)$/);
          if (match) {
            const handlerType = attr.name.slice(2)
            const handler = this.eventHandlers.get(parseInt(match[1], 10))
            el.addEventListener(handlerType, handler.bind(this));
            el.removeAttribute(attr.name);
            el.setAttribute("air-event-"+handlerType, handler.name)
          }
        });
      });
    }

    addEventHandler(idx, handler) {
      this.eventHandlers.set(idx, handler);
    }

    addStateHandler(id, handler) {
      this.stateHandlers.set(id, handler);
    }

    updateStateValues() {
      const dynamicStyles = new Map(
        Array.from(styleMap).filter(([key]) => key[1] !== "static")
      );

      this.stateHandlers.forEach((handler, id) => {
        const value = handler.getValue();
        this.querySelectorAll(`[data-state="${id}"]`).forEach(el => el.textContent = value);
        attributeMap.forEach((attrs, eid) => {
          const attr = attrs.find(attr => attr.stateId === id);
          if (attr) {
            this.querySelector(`[air-state-id="${eid}"]`)?.setAttribute(attr.attrName, value);
          }
        });
        console.log("yohooo dumbo: ",this.stateSubscriptions)
        // Assuming `id` is defined somewhere in your scope.
        // Filter the map entries based on `id`
        const filteredStyles = new Map([...dynamicStyles].filter(([key]) => id === key[1]));
        // Now loop over only the filtered entries
        filteredStyles.forEach((style, key) => {
            
            const [curAt, curStyle] = Object.entries(style[0])[0]; // Extract the current style attribute and value
            console.log("style: ", key, style, value, curStyle.value, curStyle.unit,curAt)
            if (value !== curStyle) { // Check if the value needs to be updated
               this.querySelector(`[air-state-id="${key[0]}"]`).style[curAt] = value + (curStyle.unit || "");

            }
        });

      });
    }
  }

  customElements.define(elementName, CustomElement);
  return component;
};


export const html = (strings, ...values) => {
  const template = document.createElement('template');
  let htmlString = '';
  
  // Join the strings array with a unique separator and perform the replacement for tags.
  const updatedHtml = strings.join("%$").replace(/<(\w+)(\s*[^>]*)>/g, (match, tagName, existingAttributes) => {
    if (!/\s+\w+=(?:,|"(,)"|'(,)'|)/g.test(match)) return `<${tagName}${existingAttributes}>`; //if no data attributes are present
    const uniqueId = Math.random().toString(36).slice(2, 15);
    attributeMap.set(uniqueId, []);
    return `<${tagName} air-state-id="${uniqueId}"${existingAttributes}>`;
  });

  // Split the updated HTML back into segments to process with values
  const segments = updatedHtml.split("%$");
  let currEl = "";
  let inStyle = false
  let styleString = ""
  let extraStyleData = false
  segments.forEach((segment, i) => {
    
    const value = values[i];
    // Check if it's the last segment
    if (i === segments.length - 1) {
      // Now check if this last segment has an exceeding index in the values array
      if (i === values.length) {
          // This means we are at the last segment and the values array has been exceeded by one
          console.log("We're on the final segment and have exceeded the values array by 1");
          htmlString += segment 
          return
      }
    }
    let valueResult = null
    if (typeof value === "function" && value?.origin === "createState"){
      valueResult = value()
    }
    //console.log("value here: ", value, styleString)
    let returnString = '';
    console.log("new striong: ", segment)
    console.log(value)
    const getLastAttribute = str => str.match(/(\w+)="$/) ? str.match(/(\w+)="$/)[1] : null;
    const state = stateMap.get(currentComponent)?.find(state => state.id === value.id);
    if (typeof value === 'function' && value?.origin === "createState"){
      console.log("its a function value from createState!: ", value.origin, value.id)
      //do more stuff with createState dynamic values
      const appendedValue = state ? `<span data-state="${state.id}">${valueResult}</span>` : (valueResult ?? '');
        console.log("in extra handling: ", appendedValue)
        returnString = segment + appendedValue;
    }else if (typeof value === 'function') {
      console.log("fuunc val: ", value)

      returnString = segment + `placeholder-for-event-${i}`;
    } else if (state && getLastAttribute(segment)) {
      console.log("it's an attribute?: ", getLastAttribute(segment))
      //const airStateId = segment.match(/air-state-id="([^"]*)"/)?.[1];
      const airStateId = [...segment.matchAll(/air-state-id="([^"]*)"/g)].pop()?.[1];

      console.log("found id: ", airStateId)
      console.log("from: ", segment)
      console.log("fucked version: ", segment.replace(/(\w[\w-]*)\s*=\s*[^=]*$/,""))
      if (airStateId) {
        currEl = airStateId; // Track the current element
      }
      
      attributeMap.set(currEl, [
        ...(attributeMap.get(currEl) || []),
        { stateId: state?.id, attrName: getLastAttribute(segment), value: valueResult }
      ]);

      returnString = segment+valueResult
    } else {
      if (!inStyle && segment.includes("style=")){
        console.log("started style string")
        inStyle = true
        const hasCompleteStyle = (s) => /style="[^"]*"/.test(s);

        const findPartialStyleStartIndex = (s) => {
          const fullStylesMatch = s.match(/style="[^"]*"/g);
          if (fullStylesMatch) {
            const lastIndex = s.lastIndexOf(fullStylesMatch[fullStylesMatch.length - 1]) + fullStylesMatch[fullStylesMatch.length - 1].length;
            const partialMatch = s.slice(lastIndex).match(/style="[^"]*$/);
            return partialMatch ? lastIndex + partialMatch.index : -1;
          } else {
            const partialOnlyMatch = s.match(/style="[^"]*$/);
            return partialOnlyMatch ? partialOnlyMatch.index : -1;
          }
        };
        
        // Process the segment
        if (hasCompleteStyle(segment)) {
          console.log("It has at least one full style: ", segment);
          const partialStartIndex = findPartialStyleStartIndex(segment);
          if (partialStartIndex === -1) {
            console.log("Safe to add to HTML string");
            htmlString += segment;
            segment = "";
            inStyle = false;
          } else {
            console.log("Partial style detected at the end.");
            handlePartialStyles(segment, partialStartIndex, i);
          }
        } else {
          console.log("Here, I guess it has only one partial style nothing else: ", styleString);
          const partialStartIndex = findPartialStyleStartIndex(segment);
          if (partialStartIndex !== -1) {
            handlePartialStyles(segment, partialStartIndex, i);
          }
        }
        
        // Function to handle partial styles and check next segment
        function handlePartialStyles(segment, startIndex, i) {
          const airStateId = segment.match(/air-state-id="([^"]*)"/g)?.slice(-1)[0]?.match(/"([^"]*)"/)[1];
          if (airStateId) {
            currEl = airStateId; // Track the current element
          }
          htmlString += segment.substring(0, startIndex);
          console.log("Added to html: ", segment.substring(0, startIndex));
          console.log("pre mod style string: ", styleString)
          styleString += segment.substring(startIndex)+valueResult;
          console.log("Adding this to style string: ", segment.substring(startIndex)+valueResult);
          console.log("End coming immediately? : ", segments[i+1].slice(0,3) == ';">');
          if (segments[i+1].slice(0,3) !== ';">' && segments[i+1].includes(';">')) {
            console.log("End is in next segment, but with stuff before: ", segments[i+1]);
            const extraStyleData = segments[i+1].split(';">')[0];
            console.log("adding extra: ", extraStyleData)
            styleString += extraStyleData;
            console.log("ss now: ", styleString)
            segments[i+1] = segments[i+1].replace(extraStyleData, "");
            console.log("Next segment now: ", segments[i+1]);
          }
          segment = "";
        }
        


      }
      if (inStyle && segment.trimStart().slice(0,3) == ';">'){
        console.log("end of style string: ", segment)
        styleString += segment.split('>')[0]
        console.log("whole style string: ", styleString)
        let styleObject = Object.fromEntries(
          styleString
              .replace(/^style="|"$|;$/g, "")  // Remove the 'style="' at the start, '"' at the end, and ';' at the end.
              .replace('style="',"")
              .split(";")                      // Split by ';' to get individual style rules.
              .filter(s => s.includes(':'))    // Filter out any empty or malformed rules.
              .map(s => {
                  const [property, value] = s.split(":").map(x => x.trim()); // Split by ':' and trim whitespace.
                  const numericMatch = value.match(/^(\d+(?:\.\d+)?)([a-z%]+)$/i); // Regex for numeric values with units.
                  if (numericMatch) {
                      return [property, { value: parseFloat(numericMatch[1]), unit: numericMatch[2] }];
                  } else {
                      // Treat the entire string as the value for complex properties or keywords
                      return [property, { value: value, unit: null }];
                  }
              })
          );
        console.log("checking against: ", stateMap)
        Object.entries(styleObject).forEach(([prop, value]) => {
          console.log("value: ", value.value)
          console.log("cuur map: ", stateMap.get(currentComponent))
          const stateEntry = stateMap.get(currentComponent)?.find(state => state.value === value.value);
          if (stateEntry) {
            console.log("yep")
            const existingEntries = styleMap.get([currEl, stateEntry.id]) || [];
            styleMap.set([currEl, stateEntry.id], [...existingEntries, { [prop]: value }]);
          }
        });
        segment = styleString+segment.replace(segment.trimStart().slice(0,2), "") //reconstruct the segment with the full style string and add to the template for initial render. This also sets static values.
        inStyle = false
      }
      console.log("statemap right now monkey: ", stateMap.get(currentComponent))
      const state = stateMap.get(currentComponent)?.find(state => state.id === value.id);
      if (inStyle){
        //styleString += segment+value
        if (extraStyleData){
          //styleString+=extraStyleData
          extraStyleData = false
        }
        returnString = ""

      }else{
        
        const appendedValue = state ? `<span data-state="${state.id}">${valueResult}</span>` : (valueResult ?? '');
        console.log("in extra handling: ", appendedValue)
        returnString = segment + appendedValue;
      }
    }
    console.log("adding string: ", returnString)
    htmlString += returnString;
    console.log("html string now: ", htmlString)
  });

  template.innerHTML = htmlString;

  // Setup event handlers if value is a function
  values.forEach((value, idx) => {
    if (typeof value === 'function' && !value.origin) {
      currentComponent.addEventHandler(idx, value);
    }
  });

  return template;
};


let stateId = 0;
export const createState = (initialValue) => {
  if (!currentComponent) throw new Error("createState must be called within a component context");
  
  let value = initialValue;
  let listeners = new Set();
  let id = `__state_${stateId++}`;

  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener); // Returns an unsubscribe function
  };

  const getValue = () => value;
  getValue.id = id; 
  getValue.origin = 'createState';
  getValue.attr = () => ({ isAttribute: true, value });
  getValue.onUpdate = subscribe; 

  const setValue = newValue => {
    if (value !== newValue) {
      value = newValue;
      listeners.forEach(listener => listener(newValue));
    }
  };

  const stateHandlers = stateMap.get(currentComponent) || [];
  stateHandlers.push({ id, value, listeners });
  stateMap.set(currentComponent, stateHandlers);

  

  // Attach both getValue and subscribe to stateHandlers
  currentComponent.stateHandlers.set(id, { getValue, subscribe });
  //return [getValue, setValue, subscribe];
  return [getValue, setValue];
};

  

export const onMount = callback => currentComponent.addEventListener('mount', callback);
export const onUnmount = callback => currentComponent.addEventListener('unmount', () => setTimeout(callback, 0));
