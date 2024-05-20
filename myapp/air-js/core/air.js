// air.js
import processHtml from "../processors/html2.js"

export const html = (strings, ...values) => {

  //return processHtml(currentComponent,componentState.get(currentComponent),strings, ...values)
  return processHtml(strings, values, currentComponent,componentState.get(currentComponent))
} 
let currentComponent = null;
const componentStateHandlers = new WeakMap();
const componentState = new Map();
export const AirComponent = (elementName, component) => {

  class CustomElement extends HTMLElement {

    constructor() {
      super();
      componentState.set(this, {elements: new Map})

      currentComponent = this;
      
      componentStateHandlers.set(this, {
        eventHandlers: new Map(),
        stateHandlers: new Map(),
        stateSubscriptions: [],
        stateMap: new Map(),
        attributeMap: new Map(),
        styleMap: new Map(),
        currentComponent: this // Store currentComponent in the handler map
      });
    }

    connectedCallback() {
      console.log("rendering")
      this.render();
      //this.setupStateSubscriptions();
    }
    disconnectedCallback() {
      this.teardownStateSubscriptions(); // Cleanup subscriptions on unmount
      if (currentComponent === this) {
        currentComponent = null;
      }
    }
    setupStateSubscriptions() {
      const handlers = componentStateHandlers.get(this);
      console.log(handlers)
      const { stateMap, stateSubscriptions } = handlers;
      stateMap.forEach((stateObj, id) => {
          const { subscribe, getValue } = stateObj;
          const subscription = subscribe(() => {
              // Update only subscribers to this particular state
              this.updateSubscribers(this, getValue());
          });
          stateSubscriptions.push(subscription);
      });
    }
    updateSubscribersold(component, value) {
      //const handlers = componentStateHandlers.get(this)
      const elements = componentState.get(component)?.elements
      console.log("component: ", component)
      console.log("component elements: ", elements)
      console.log("new element value: ", value, value.id)
      //console.log("old element value: ", component.querySelector(`[data-elem-id="${eid}"]`))
      // Update only elements that are specifically listening to this state
      //component.querySelectorAll(`[air-data-state="${id}"]`).forEach(el => el.textContent = value);
      if (elements.size < 1){
        console.log("no elements")
        return
      }else{
        // Update attributes specifically bound to this state
        elements.forEach((el, key)=>{
          //console.log("el: ", el)
          el.attributes.forEach((attrs, eid) => {
            const attr = attrs.find(attr => attr.stateId === id);
            if (attr) {
              component.querySelector(`[air-state-id="${eid}"]`)?.setAttribute(attr.attrName, value);
            }
          });
    
          // Update styles specifically bound to this state
          el.styles.forEach((styles, key) => {
            styles.forEach(s => {
              const element = component.querySelector(`[air-state-id="${key ? key[0] : ''}"]`);
              if (element) {
                // Capture the current inline styles of the element
                const currentInlineStyles = element.getAttribute('style');
                // Remove every object style property/value combo from the inline styles
                if (currentInlineStyles) {
                  const inlineStylesArray = currentInlineStyles.split(';');
                  const filteredStyles = inlineStylesArray.filter(style => {
                    const [property, value] = style.split(':').map(item => item.trim());
                    return !styles.some(s => s.property === property && s.value === value);
                  });
                  element.setAttribute('style', filteredStyles.join(';'));
                }
                // Apply the styles from the stylemap
                element.style[s.property ? s.property : ''] = s.value ? s.value() + (s.unit ? s.unit : '') : '';
              }
            });
          });
          el.content.forEach(newVal=>{
            const dataSpan = document.querySelector(`[data-elem-id="${key}"]`)
            console.log(" dataSpan: ", dataSpan)
            console.log("val: ", newVal)
          })
        })
      }


    }
    updateSubscribers(component, value, id, oldValue) {
      
      //const handlers = componentStateHandlers.get(this)
      const elements = componentState.get(component)?.elements
      console.log("elements in uupdate sub: ", elements)
      const targets = component?.querySelectorAll(`[air-state-id="${id}"]`)
      console.log("targets? : ", targets)
      targets.forEach(target=>{
        
        const vdom = elements.get(target.getAttribute("data-elem-id")).states
        console.log("target element vdom entry: ",vdom)
        //const match = vdom.find(l=>l.id === value.id)
      
        //console.log("need to place the updated value: ",value() ,"in location: ", match.location, " of element: ", target)
  
        //if (match.location === "content"){
          target.textContent = value()
        //}
      })
      
      

      /** 
      const activeElements = Array.from(document.querySelectorAll("[air-state-id]")) 
      activeElements?.forEach(el=>{
      
        const airId = el.getAttribute("air-state-id")
        const st = elements.find(e=>e.states.find(c=>c.id===airId))
        console.log("random find attempt lol: ", st)
        console.log("testing: ", airId)
        if (airId === id){
          console.log("found the target: ", el)
          console.log("need to place the updated value in location: ", targetLocation)
          if (targetLocation === "content"){
            el.textContent = value()
          }
        }
      })
      
      //console.log("old element value: ", component.querySelector(`[data-elem-id="${eid}"]`))
      // Update only elements that are specifically listening to this state
      //component.querySelectorAll(`[air-data-state="${id}"]`).forEach(el => el.textContent = value);
      if (elements.size < 1){
        console.log("no elements")
        return
      }else{
        // Update attributes specifically bound to this state
        elements.forEach((el, key)=>{
          //console.log("el: ", el)
          el.attributes.forEach((attrs, eid) => {
            const attr = attrs.find(attr => attr.stateId === id);
            if (attr) {
              component.querySelector(`[air-state-id="${eid}"]`)?.setAttribute(attr.attrName, value);
            }
          });
    
          // Update styles specifically bound to this state
          el.styles.forEach((styles, key) => {
            styles.forEach(s => {
              const element = component.querySelector(`[air-state-id="${key ? key[0] : ''}"]`);
              if (element) {
                // Capture the current inline styles of the element
                const currentInlineStyles = element.getAttribute('style');
                // Remove every object style property/value combo from the inline styles
                if (currentInlineStyles) {
                  const inlineStylesArray = currentInlineStyles.split(';');
                  const filteredStyles = inlineStylesArray.filter(style => {
                    const [property, value] = style.split(':').map(item => item.trim());
                    return !styles.some(s => s.property === property && s.value === value);
                  });
                  element.setAttribute('style', filteredStyles.join(';'));
                }
                // Apply the styles from the stylemap
                element.style[s.property ? s.property : ''] = s.value ? s.value() + (s.unit ? s.unit : '') : '';
              }
            });
          });
          el.content.forEach(newVal=>{
            const dataSpan = document.querySelector(`[data-elem-id="${key}"]`)
            //console.log(" dataSpan: ", dataSpan)
            //console.log("val: ", newVal)
          })
          el?.maps.forEach(map=>{
            //console.log("rednderrd map: ",map[0])
            
            const egg = value.map(map[0].map)()
            const elementKeys = Array.from(target.querySelectorAll('*'))
                .filter(c => c.getAttribute('data-elem-id'))
                .map(c => c.getAttribute('data-elem-id'));


            elementKeys.forEach(c => {

                if (elements.has(c)) {

                    elements.delete(c);
                } else {
                    console.log("Key not found:", c);  // This will clarify if some keys are not found
                }
            });


            target.innerHTML = egg.join("")

            currentComponent.attachEventListeners()
          })
        })
      }
*/

    }
  
    teardownStateSubscriptions() {
      this.stateSubscriptions.forEach(unsubscribe => unsubscribe());
      this.stateSubscriptions = [];
    }
    async render() {
      const templateString = component.call(this);
      this.innerHTML = '';
      this.innerHTML = templateString
      //this.appendChild(document.importNode(template.content, true));
      this.attachEventListeners();
      //this.setupStateSubscriptions();
    }

    attachEventListeners() {
      const elements = componentState.get(currentComponent)?.elements

      elements.forEach((value, key) => {
        if (value.events?.length > 0) {

            const element = document.querySelector(`[data-elem-id="${key}"]`);
            console.log("has events: ", value.events);
            value.events.forEach(([eventName, handler]) => {
                console.log("event name: ", eventName);
                console.log("event handler: ", handler);
                element.addEventListener(eventName.substring(2), handler)

                //element.removeAttribute("data-elem-id")
            });
        }
    });
      const handlers = componentStateHandlers.get(this)
      const { eventHandlers } = handlers
      this.querySelectorAll('*').forEach(el => {
        Array.from(el.attributes).forEach(attr => {
          const match = attr.value.match(/^placeholder-for-event-(\d+)$/);
          if (match) {
            const handlerType = attr.name.slice(2)
            const handler = eventHandlers.get(parseInt(match[1], 10))
            el.addEventListener(handlerType, handler.bind(this));
            el.removeAttribute(attr.name);
            el.setAttribute("air-event-"+handlerType, handler.name)
          }
        });
      });
    }

    addEventHandler(idx, handler) {
      const handlers = componentStateHandlers.get(this);
      const { eventHandlers } = handlers;
      eventHandlers.set(idx, handler);
    }

    addStateHandler(id, handler) {
      const handlers = componentStateHandlers.get(this);
      const { stateHandlers } = handlers;
      stateHandlers.set(id, handler);
    }


  }

  customElements.define(elementName, CustomElement);
  return component;
};

export const createState = (initialValue) => {
  if (!currentComponent) throw new Error("createState must be called within a component context");
  const stateId = Math.random().toString(36).slice(2, 15);
  let value = initialValue;
  let handlers = new Set();
  let id = `air__state_${stateId}`;
  
  const subscribe = (handler) => {
    handlers.add(handler);
    return () => handlers.delete(handler); // Returns an unsubscribe function
  };

  subscribe(currentComponent.updateSubscribers);
  const getValue = () => value;
  getValue.id = id; 
  getValue.origin = 'createState';
  getValue.onUpdate = subscribe; 
  getValue.map = function(callback, thisArg) {
    if (!Array.isArray(value)) {
      throw new Error("Cannot iterate a non-array item");
    } else {
      const mappedFunction = function() {
        return value.map(callback, thisArg);
      };
      
      // Assign a tag or ID to the mapped function
      mappedFunction.tag = 'mappedFunction';
      mappedFunction.id = id;
      mappedFunction.callback = callback;
      return mappedFunction;
    }
  };

  const setValue = (newValue) => {
    if (value !== newValue) {
      const oldValue = getValue
      value = newValue;
      console.log("current state: ", componentState.get(currentComponent))
      handlers.forEach(handler => handler(currentComponent, getValue, id,oldValue));
      
    }
  };

  return [getValue, setValue];
};

export const onMount = callback => currentComponent.addEventListener('mount', callback);
export const onUnmount = callback => currentComponent.addEventListener('unmount', () => setTimeout(callback, 0));
