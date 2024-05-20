// air.js
//const stateMap = new WeakMap(); //this, attr and style maps need to be component scope
//const attributeMap = new Map();
//const styleMap = new Map();
let currentComponent = null;

export const AirComponent = (elementName, component) => {

  class CustomElement extends HTMLElement {
    static DEFAULT_PROCESSOR = 'html'; //standard template processor, used processor can be overridden by setting this.processor in component.

    constructor() {
      super();
      currentComponent = this;
      this.componentId = `custom_${Math.random().toString(36).slice(2, 15)}`;
      this.eventHandlers = new Map();
      this.stateHandlers = new Map();
      this.stateSubscriptions = [];
      this.stateMap = new WeakMap().set(this, []); //this, attr and style maps need to be component scope
      this.attributeMap = new Map();
      this.styleMap = new Map();
      this.processHtml = processHtml;
    }
    htmlv2 = (strings, ...values) => {
      const template = document.createElement('template');
      let htmlString = '';
    
      const processed = this.processHtml(strings, values)
      console.log("processed html: ", processed)
    
      template.innerHTML = htmlString
      return template
    }
    connectedCallback() {
      this.render();
      //this.setupStateSubscriptions();
    }
    disconnectedCallback() {
      this.teardownStateSubscriptions(); // Cleanup subscriptions on unmount
    }
    setupStateSubscriptions() {
      this.stateHandlers.forEach((stateObj, id) => {
          const { subscribe, getValue } = stateObj;
          const subscription = subscribe(() => {
              // Update only subscribers to this particular state
              this.updateSubscribers(id, getValue());
          });
          this.stateSubscriptions.push(subscription);
      });
    }
    
    updateSubscribers(id, value) {
      // Update only elements that are specifically listening to this state
      this.querySelectorAll(`[data-state="${id}"]`).forEach(el => el.textContent = value);
  
      // Update attributes specifically bound to this state
      this.attributeMap.forEach((attrs, eid) => {
          const attr = attrs.find(attr => attr.stateId === id);
          if (attr) {
              this.querySelector(`[air-state-id="${eid}"]`)?.setAttribute(attr.attrName, value);
          }
      });
  
      // Update styles specifically bound to this state
      const dynamicStyles = new Map(
          Array.from(this.styleMap).filter(([key]) => key[1] === id)
      );
  
      dynamicStyles.forEach((style, key) => {
          const [curAt, curStyle] = Object.entries(style[0])[0]; // Extract the current style attribute and value
          this.querySelector(`[air-state-id="${key[0]}"]`).style[curAt] = value + (curStyle.unit || "");
      });
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
      //this.updateStateValues();
      this.setupStateSubscriptions();
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
        Array.from(this.styleMap).filter(([key]) => key[1] !== "static")
      );

      this.stateHandlers.forEach((handler, id) => {
        const value = handler.getValue();
        this.querySelectorAll(`[air-data-state="${id}"]`).forEach(el => el.textContent = value);
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

const getLastAttribute = str => {
  const match = /(\w+)=$/.exec(str);
  return match ? match[1] : null;
};

const tagStatefulAttributeElements = (strings) => { 
  const uniqueIdGenerator = () => Math.random().toString(36).slice(2, 15);
  const seperator = '\uE000';
  strings = strings.join(seperator).replace(/<(\w+)(\s*[^>]*)>/g, (match, tagName, existingAttributes) => {
      if (!/\s+\w+=(?:,|"(,)"|'(,)'|)/g.test(match)) return `<${tagName}${existingAttributes}>`; //if no data attributes are present
      const uniqueId = uniqueIdGenerator();
      currentComponent.attributeMap.set(uniqueId, []);
      return `<${tagName} air-state-id="${uniqueId}"${existingAttributes}>`;
    }
  );
  return strings.split(seperator)
};

const getLastAirStateId = (html) => {
  const matches = html.match(/air-state-id="([^"]+)"/g);
  return matches ? matches[matches.length - 1].match(/"([^"]+)"/)[1] : null;
}
const extractCSSPropertyName = (styleString) => {
  const match = styleString.match(/(?:^|[";\s])([\w-]+)\s*:(?!=)/);
  return match ? match[1] : '';
}
// Join the strings array with a unique separator and perform the replacement for tags.
const processHtml = (strings, values) => {
  // Step 1: tag all elements containing stateful data
  strings = tagStatefulAttributeElements(strings)
  // Step 2: Compose the full HTML string from all parts and values
  let composedHtml = strings[0];
  for (let i = 1; i < strings.length; i++) {
    let v = null
    
    console.log("value: ", values[i-1])
    if ( typeof values[i-1] === "function" && values[i-1]?.origin === "createState"){
      const state = currentComponent.stateMap.get(currentComponent)?.find(state => state.id === values[i-1].id);
      console.log("value origin: ", values[i-1]?.origin, values[i-1]())
      const leaderChar = strings[i-1][strings[i-1].length - 1]
      console.log("leaderchar: ", leaderChar)
      if (leaderChar === ":"){
        const fullStylePropertyData = {
          property:extractCSSPropertyName(strings[i-1]),
          value:values[i-1],
          extension:strings[i][0] !== ';' ? strings[i].split(';')[0] : ''
        }

        console.log("style attribute value: ", composedHtml)
        console.log("current segment: ", strings[i-1])

        console.log("style attribute data: ", fullStylePropertyData)
        
        if (fullStylePropertyData.extension){
          strings[i] = strings[i].replace(fullStylePropertyData.extension,"")
        }
        if (state) {
          const elementAirId = getLastAirStateId(strings.slice(0, i).join(''))
          const existingEntries = currentComponent.styleMap.get([elementAirId, state.id]) || [];
          currentComponent.styleMap.set([elementAirId, state.id], [...existingEntries, fullStylePropertyData]);
        }
        v = `${values[i-1].id}`
      }
    
      else if(leaderChar === "=" && !strings[i-1]?.includes("style=")){
        console.log("attribute value")
        v = `"${values[i-1]()}"`
        const elementAirId = getLastAirStateId(strings.slice(0, i).join(''))
        currentComponent.attributeMap.set(elementAirId, [
          ...(currentComponent.attributeMap.get(elementAirId) || []),
          { stateId: state?.id, attrName: getLastAttribute(strings[i-1]), value: values[i-1]() }
        ]);
      }else{
        console.log("text node value")
        v = `<span air-data-state="${values[i-1].id}">${values[i-1]()}</span>`;
      }
    }else if(typeof values[i-1] === "function" && !values[i-1].origin){ //event handler
      currentComponent.addEventHandler(i-1, values[i-1]); 
      v = `air-event-id="${i-1}"`;

    }else if(typeof values[i-1] === "function"){ //static function unspecified
      console.log("undetected function edge case")
      v = values[i-1]
    }
    else{
      console.log("undetected other edge case")
      v = values[i-1]
    }
    composedHtml += (v || '') + strings[i];
    console.log("composed html at the end of segment loop: ", composedHtml)
  }
  console.log("result of initial compisition: ", composedHtml)

  console.log("result of style map: ", currentComponent.styleMap)
  console.log("result of attribute map: ", currentComponent.attributeMap)
  return composedHtml;
};

export const htmlv2 = (strings, ...values) => {
  const template = document.createElement('template');
  let htmlString = '';

  const processed = processHtml(strings, values)
  console.log("processed html: ", processed)

  template.innerHTML = htmlString
  return template
}


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
  let inStyle = false;
  let styleString = "";
  let extraStyleData = false;
  
  segments.forEach((segment, i) => {
    console.log("in style right now: ", inStyle);
    const value = values[i];
    // Check if it's the last segment
    if (i === segments.length - 1) {
      // Now check if this last segment has an exceeding index in the values array
      if (i === values.length) {
        // This means we are at the last segment and the values array has been exceeded by one
        console.log("We're on the final segment and have exceeded the values array by 1");
        htmlString += segment;
        return;
      }
    }
    let valueResult = null;
    if (typeof value === "function" && value?.origin === "createState") {
      valueResult = value();
    }
    let returnString = '';
    console.log("new string: ", segment);
    console.log(value);
    const getLastAttribute = str => str.match(/(\w+)="$/) ? str.match(/(\w+)="$/)[1] : null;
    const state = stateMap.get(currentComponent)?.find(state => state.id === value.id);
    if (typeof value === 'function' && value?.origin === "createState" && !getLastAttribute(segment) && !segment.includes("style=") && !inStyle) {
      console.log("its a function value from createState!: ", value.origin, value.id);
      const appendedValue = state ? `<span data-state="${state.id}">${valueResult}</span>` : (valueResult ?? '');
      console.log("in extra handling: ", appendedValue);
      returnString = segment + appendedValue;
    } else if (typeof value === 'function' && !value.origin) {
      console.log("func val: ", value);
      returnString = segment + `placeholder-for-event-${i}`;
    } else if (state && getLastAttribute(segment)) {
      console.log("it's an attribute?: ", getLastAttribute(segment));
      const airStateId = [...segment.matchAll(/air-state-id="([^"]*)"/g)].pop()?.[1];
      console.log("found id: ", airStateId);
      console.log("from: ", segment);
      console.log("fucked version: ", segment.replace(/(\w[\w-]*)\s*=\s*[^=]*$/, ""));
      if (airStateId) {
        currEl = airStateId; // Track the current element
      }
      attributeMap.set(currEl, [
        ...(attributeMap.get(currEl) || []),
        { stateId: state?.id, attrName: getLastAttribute(segment), value: valueResult }
      ]);
      returnString = segment.replace(/="$/, `="${valueResult}`);
    } else {
      if (!inStyle && segment.includes("style=")) {
        console.log("started style string");
        inStyle = true;
        styleString = segment+valueResult;
        console.log("fucker: ",styleString)
      } else if (inStyle) {
        console.log("fucker: ",styleString)
        // Check if the segment is a createState value
        if (typeof value === "function" && value?.origin === "createState") {

          // Replace the style attribute value with the valueResult
          styleString = styleString.replace(/:\s*;/, `: ${valueResult};`);
        }
        styleString += segment
        if (segment.includes(';">')) {
          // End of style string found
          let styleObject = Object.fromEntries(
            styleString
              .replace(/^style="|"$|;$/g, "")
              .replace('style="', "")
              .split(";")
              .filter(s => s.includes(':'))
              .map(s => {
                const [property, value] = s.split(":").map(x => x.trim());
                const numericMatch = value.match(/^(\d+(?:\.\d+)?)([a-z%]+)$/i);
                if (numericMatch) {
                  return [property, { value: parseFloat(numericMatch[1]), unit: numericMatch[2] }];
                } else {
                  return [property, { value: value, unit: null }];
                }
              })
          );
          Object.entries(styleObject).forEach(([prop, value]) => {
            const stateEntry = stateMap.get(currentComponent)?.find(state => state.value === value.value);
            if (stateEntry) {
              const existingEntries = styleMap.get([currEl, stateEntry.id]) || [];
              styleMap.set([currEl, stateEntry.id], [...existingEntries, { [prop]: value }]);
            }
          });
          const [styleStringPart, remainingSegment] = styleString.split(';">');
          htmlString += styleStringPart + ';">';
          inStyle = false;
          styleString = "";
          console.log("stylemap: ", styleMap)
          // Process the remaining part of the segment
          if (remainingSegment) {
            segment = remainingSegment;
            // Continue processing the remaining segment
            if (typeof value === 'function' && value?.origin === "createState") {
              const appendedValue = state ? `<span data-state="${state.id}">${valueResult}</span>` : (valueResult ?? '');
              returnString = segment + appendedValue;
            } else {
              returnString = segment;
            }
          }
        }else{
          styleString+=valueResult;
        }
      } else {
        console.log("statemap right now monkey: ", stateMap.get(currentComponent));
        const state = stateMap.get(currentComponent)?.find(state => state.id === value.id);
        const appendedValue = state ? `<span data-state="${state.id}">${valueResult}</span>` : (valueResult ?? '');
        console.log("in extra handling22222: ", appendedValue);
        returnString += appendedValue;
      }
    }
    console.log("adding string: ", returnString);
    htmlString += returnString;
    console.log("html string now: ", htmlString);
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
  let id = `air__state_${stateId++}`;

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

  const stateHandlers = currentComponent.stateMap.get(currentComponent);
  stateHandlers.push({ id, value, listeners });
  currentComponent.stateMap.set(currentComponent, stateHandlers);

  

  // Attach both getValue and subscribe to stateHandlers
  currentComponent.stateHandlers.set(id, { getValue, subscribe });
  //return [getValue, setValue, subscribe];
  return [getValue, setValue];
};

  

export const onMount = callback => currentComponent.addEventListener('mount', callback);
export const onUnmount = callback => currentComponent.addEventListener('unmount', () => setTimeout(callback, 0));
