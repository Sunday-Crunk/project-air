
export const html = (strings, ...values) => {
  //console.log("v: ", values)
  return {
    strings,
    values,
    htmlTemplate:true
  }
};

const FocusManager = {
  focusPath: null,
  focusAttributes: null,
  setFocusAttributes(attributes){
    this.focusAttributes = attributes
  },
  setFocusPath(path) {
      this.focusPath = path;
  },
  getPathToElement(element){
    const path = [];
    while (element && element !== document.body) {
        const parent = element.parentNode;
        const index = Array.prototype.indexOf.call(parent.children, element);
        path.unshift(index);
        element = parent;
    }
    return path;
  },
  restoreFocus(root) {
      let element = root;
      for (const index of this.focusPath) {
          if (!element || index > element.children.length) return;
          element = element.children[index];
      }
      if (element) {
          element.focus();
          
          this.focusAttributes?.forEach(a=>{
            //first handling special attributes like caret position
            if (a.name === "selectionStart" && a.value > 0){ 
              element.selectionStart = a.value    
            }

          })
      }
  }
};


let performanceReports = [];

const monitorPerformance = (reportThreshold, monitorInterval, performanceDegradationThreshold) => {
  const generateStatusReport = () => {
    let totalTasks = 0, totalDeferred = 0, totalExecuted = 0;
    performanceReports.forEach(report => {
      totalTasks += report.total;
      totalDeferred += report.deferred;
      totalExecuted += report.executed;
    });

    const averageTime = performanceReports.reduce((acc, report) => acc + report.time, 0) / performanceReports.length;
    console.log(`Status Report: ${performanceReports.length} reports, Total: ${totalTasks}, Deferred: ${totalDeferred}, Executed: ${totalExecuted}, Average time: ${averageTime.toFixed(2)}ms`);
  };

  const checkForPerformanceDegradation = () => {
    const degradationReports = performanceReports.filter(report => report.time > performanceDegradationThreshold);
    if (degradationReports.length > 0) {
      performanceReports = [];
      console.warn(`Performance Degradation Detected: ${degradationReports.length} reports exceeding ${performanceDegradationThreshold}ms`);
    }
  };

  setInterval(() => {
    const reportSize = performanceReports.length;
    if (reportSize >= reportThreshold) {
      generateStatusReport();
      performanceReports.splice(0, reportSize);
    }
    checkForPerformanceDegradation();
  }, monitorInterval);
};

const REPORT_THRESHOLD = 200;
const MONITOR_INTERVAL = 5000;
const PERFORMANCE_DEGRADATION_THRESHOLD = 2;

monitorPerformance(REPORT_THRESHOLD, MONITOR_INTERVAL, PERFORMANCE_DEGRADATION_THRESHOLD);
class RenderManager {
    constructor(timeLimit = 150, debounceTime = 10) {
    this.primaryQueue = [];
    this.secondaryQueue = [];
    this.renderScheduled = false;
    this.timeLimit = timeLimit;
    this.batchedUpdates = new Set();
    this.isBatchingUpdates = false;
    this.componentUpdates = new Map();
    this.debounceTime = debounceTime;
    this.debounceTimer = null;
  }

  addPrimaryRender(fn) {
    this.batchedUpdates.add(fn);
    this.scheduleBatchedRender();
  }

  addSecondaryRender(fn) {
    this.secondaryQueue.push(fn);
    this.scheduleBatchedRender();
  }

  scheduleBatchedRender() {
    if (!this.isBatchingUpdates) {
      this.isBatchingUpdates = true;
      Promise.resolve().then(() => this.flushBatchedUpdates());
    }
  }

  flushBatchedUpdates() {
    this.primaryQueue = Array.from(this.batchedUpdates);
    this.batchedUpdates.clear();
    this.executeRenderImmediately();
    this.isBatchingUpdates = false;
  }

  executeRenderImmediately() {
    const startTime = performance.now();
    let executedTasks = 0;
    
    while (this.primaryQueue.length > 0 && performance.now() - startTime < this.timeLimit) {
      const task = this.primaryQueue.shift();
      task();
      executedTasks++;
    }

    const endTime = performance.now();
    performanceReports.push({
      total: executedTasks + this.primaryQueue.length,
      deferred: this.primaryQueue.length,
      executed: executedTasks,
      time: endTime - startTime
    });

    if (this.primaryQueue.length > 0 || this.secondaryQueue.length > 0) {
      this.scheduleRender();
    }
  }

  scheduleRender() {
    if (!this.renderScheduled) {
      this.renderScheduled = true;
      requestAnimationFrame(() => {
        this.executeTasks(this.primaryQueue, 'primary');
        this.executeTasks(this.secondaryQueue, 'secondary');
        this.renderScheduled = false;
      });
    }
  }

  executeTasks(queue, queueType) {
    const startTime = performance.now();
    let executedTasks = 0;
    while (queue.length > 0 && performance.now() - startTime < this.timeLimit) {
      const task = queue.shift();
      task();
      executedTasks++;
    }
    const endTime = performance.now();
    performanceReports.push({
      total: executedTasks + queue.length,
      deferred: queue.length,
      executed: executedTasks,
      time: endTime - startTime,
      queueType
    });
    if (queue.length > 0) {
      this.scheduleRender();
    }
  }
}

const renderManager = new RenderManager;


class ReactiveState {
  constructor(initialValue) {
    let value = initialValue;
    this.subscribers = new Map(); // Map of components to their subscribers
    this.onUpdateSubscribers = new Set();
    this.prev = null;
    this.trim = () => value.trim();

    this.map = (renderFunc) => {
      const total = value.map((v, i) => renderFunc(v, i));
      const getter = () => {
        const total = [];
        value.forEach(v => {  
          const {strings, values} = renderFunc(v);
          const renderedItem = currentComponent.processTemplate(strings, values);
          total.push(renderedItem);
        });
        return total.join('');  
      };

      return total.every(item => item && item.htmlTemplate) ? { get: getter, isStateArray: true } : total;
    };

    this.read = () => {
      const effect = getCurrentEffect();
      if (effect) {
        const component = currentComponent;
        if (!this.subscribers.has(component)) {
          this.subscribers.set(component, new Set());
        }
        this.subscribers.get(component).add(effect);
      }
      return value;
    };

    this.onUpdate = (handler) => this.onUpdateSubscribers.add(handler);

    this.write = (newValue, proxy, options) => {
      this.prev = value;
      if (typeof newValue === 'function') {
        newValue = newValue(value);
      }
      if (newValue !== value) {
        value = newValue;
        if (renderManager) {
          renderManager.addPrimaryRender(() => {
            this.subscribers.forEach((componentSubscribers, component) => {
              componentSubscribers.forEach(sub => sub(value));
            });
          });
          renderManager.addSecondaryRender(() => {
            this.onUpdateSubscribers.forEach(sub => sub(value));
          });
        }
      }
    };
    this.removeComponentSubscribers = (component) => {
      this.subscribers.delete(component);
    };

    this[Symbol.toPrimitive] = (hint) => {
      return hint === 'string' ? String(this.read()) : (hint === 'number' ? Number(this.read()) : this.read());
    };
  }
}

const componentStateMap = new WeakMap();
let airGlobalStateHeap = null;
const createSignal = (initialValue, options) => {
  const state = new ReactiveState(initialValue);
  
  
  // Define a function to act as the target for the proxy
  const targetFunction = function() {
    return state.read(); // Or any logic you want when the proxy is called as a function
  };

  // Attach the state instance to the function
  targetFunction.state = state;


  const proxy = new Proxy(targetFunction, {
    apply(target, thisArg, argumentsList) {
      // Call the target function
      return target.apply(thisArg, argumentsList);
    },

    get(target, prop, receiver) {
      //console.log("getting prop: ", prop, target, currentComponent)
      try {
        if (prop === Symbol.toPrimitive) {
          return target.state[Symbol.toPrimitive].bind(target.state);
        }
          // if prop = "revert" send last value, this is default behaviour unrelated to temporality and only records the previous value
        if (prop === 'revert'){
          target.state.write(target.state.prev)
          return (...args)=>{
           if (args?.length === 1 && typeof args[0] === "function"){
            args[0]()
           }else if (args?.length !== 0){
            throw new Error("Invalid revert callback argument. Must be a function.")
           }
          };
        }
        if (prop === 'valueOf') {
  
          return () => target.state.read();
        }

        if (prop === 'state') {
          return target.state;
        }

        const currentValue = target.state.read();

        // Handle the case when `myVar` is accessed directly
        if (prop === 'then') {
          // To ensure compatibility with Promise-like behavior
          return undefined;
        }

        if (prop === 'trim') {
          return target.state.trim;
        }

        if (prop === 'onUpdate') {
          return target.state.onUpdate;
        }

        if (currentValue && typeof currentValue === 'object') {
          if (prop in currentValue) {
            const property = target.state.read()[prop];
            return typeof property === 'function' ? property.bind(currentValue) : property;
          }
        }
        
        if (prop === 'toLowerCase' && typeof currentValue === 'string') {
          return () => currentValue.toLowerCase();
        }

        // Check if the property exists on the target function itself
        if (prop in target) {
          return target[prop];
        }

        // Default case: return the current value
        // Handle other property access or methods
      return Reflect.get(...arguments);
        return currentValue;
      } catch (error) {
        console.error("Error accessing property:", prop, error);
        throw error; // Optionally rethrow or handle the error differently
      }
    }
  });

  if(options){ 
    const system = options?.global //avoid conflict with node window keyword
    if (system) {
      airGlobalStateHeap = airGlobalStateHeap || new Map();
      airGlobalStateHeap.set(system, [proxy, (newValue) => {
        state.write(newValue);
      }]);
      
      // Associate the current component with this global state
      if (currentComponent) {
        if (!componentStateMap.has(currentComponent)) {
          componentStateMap.set(currentComponent, new Set());
        }
        componentStateMap.get(currentComponent).add(system);
      }
    }
  }


  return [proxy, (newValue) => {
    state.write(newValue, proxy, options);
  }];
};
const allStates = new Set();
export const createState = (initialValue, options) => {
  if (options && typeof options !== "object") {
    throw new Error("Invalid argument: createState options must be an object.");
  } else if (options?.temporal && typeof options.temporal !== "boolean") {
    throw new Error(`Invalid createState temporal parameter: options.temporal must be boolean, got ${typeof options.temporal}`);
  } else if (options?.global && typeof options.global !== "string") {
    throw new Error(`Invalid createState global parameter: options.global must be the global ID as a string, got ${typeof options.global}`);
  }
  
  const [value, setValue] = createSignal(initialValue, options);

  // Track local states
  if (currentComponent && !options?.global) {
    if (!currentComponent.localStates) {
      currentComponent.localStates = new Set();
    }
    currentComponent.localStates.add(value.state);
  }
  if (!allStates.has(value.state)){
    allStates.add(value.state)
  }
  return [value, setValue];
};

const createEffect = (fn) => {
  //console.log("creating effect: ", fn)
  const execute = () => {
    cleanupEffect();
    setCurrentEffect(execute);
    fn();
    setCurrentEffect(null);
  };
  const cleanupEffect = () => {
    // Logic to remove old effects or clean up resources
    if (currentEffect && currentEffect.cleanup) {

      currentEffect.cleanup();
    }
  };
  execute();
  return { cleanup: cleanupEffect };
};

let currentEffect = null;
const setCurrentEffect = (effect) => {
  currentEffect = effect;
};

const getCurrentEffect = () => currentEffect;

// Use `instanceof` to check if it is reactive state
const isReactiveState = (value) => value instanceof ReactiveState;

export const globalState = (id) => {
  if (!airGlobalStateHeap) {
    throw new Error("Global stateheap not initialised, cannot retrieve any values");
  } else if (airGlobalStateHeap.has(id)) {
    // Associate the current component with this global state
    if (currentComponent) {
      if (!componentStateMap.has(currentComponent)) {
        componentStateMap.set(currentComponent, new Set());
      }
      componentStateMap.get(currentComponent).add(id);
    }
    return airGlobalStateHeap.get(id);
  } else {
    throw new Error("Could not find a value in the global stateheap with the ID: " + id);
  }
};

let currentComponent = null;
const setCurrentComponent = (component) => {
  currentComponent = component;
};
function analyzeCode(code, strictMode = false) {
  const createStateRegex = /const \[([a-zA-Z0-9_]+),/g;
  let variables = [];

  let match;
  while ((match = createStateRegex.exec(code)) !== null) {
    variables.push(match[1]);
  }

  let usageResults = {};
  variables.forEach(variable => {
    const regex = new RegExp(`\\b${variable}\\b(?!\\()`, 'g');
    let firstOccurrence = true;
    let usages = [];

    while ((match = regex.exec(code)) !== null) {
      if (firstOccurrence) {
        firstOccurrence = false;
        continue;
      }

      const position = match.index;
      const postVarIndex = position + variable.length;
      const postVarSnippet = code.slice(postVarIndex).trimStart();
      const nextChar = postVarSnippet[0];

      // Determine validity based on strict or non-strict mode
      let isValid = true; // Assume valid by default
      if (strictMode) {
        isValid = nextChar === '('; // In strict mode, all usages must invoke
      } else {
        // Non-strict mode only concerns logical operations and equality checks
        isValid = !(/\s*(\?|&&|\|\||==|!=)/.test(postVarSnippet)); // Check for risky logical or equality usage
        if (/[\+\-\*\/]/.test(postVarSnippet.trim()[0])) {
          isValid = true; // Allow arithmetic operations in non-strict mode
        }
      }

      // Find the full line by searching for nearest line breaks around the match
      let start = code.lastIndexOf('\n', position - 1) + 1;
      let end = code.indexOf('\n', position);
      if (end === -1) { end = code.length; } // Handle case where no newline at end
      let snippet = code.substring(start, end);

      usages.push({
        position: position,
        valid: isValid,
        snippet: snippet
      });
    }
    usageResults[variable] = usages;
  });

  return usageResults;
}


function logErrors(filteredObject, strict) {
  Object.entries(filteredObject).forEach(([key, errors]) => {
    errors.forEach(error => {
      if (!strict) console.warn(`Warning: Uninvoked proxy usage detected with ${key}. Proxies should be invoked in logical and equality operations to ensure correct behavior. (Position ${error.position}): ${error.snippet}`);
      else console.error(`Error: Detected uninvoked proxy. Proxies must be invoked on every access in strict mode. (Position ${error.position}): ${error.snippet}`
    )
    });
  });
}

export const onMount = (f) => {
  if (f && typeof f === "function") {
    currentComponent.onMountCallbacks.push(f);
  }else{
    throw new Error("Invalid onMount function. Expected function, got: " + typeof f);
  }
};

export const onUnMount = (f) => {
  if (f && typeof f === "function") {
    currentComponent.onUnMountCallbacks.push(f);
  }else{
    throw new Error("Invalid onMount function. Expected function, got: " + typeof f);
  }
};

/**
// Global interval tracking
const intervalTracker = new WeakMap();
const originalSetInterval = window.setInterval;
const originalClearInterval = window.clearInterval;

window.setInterval = function(...args) {
  const id = originalSetInterval.apply(this, args);
  const component = currentComponent; // Implement this function to get the current component
  if (component) {
    if (!intervalTracker.has(component)) {
      intervalTracker.set(component, new Set());
    }
    intervalTracker.get(component).add(id);
  }
  return id;
};

window.clearInterval = function(id) {
  originalClearInterval.call(this, id);
  for (const [component, intervals] of intervalTracker) {
    if (intervals.has(id)) {
      intervals.delete(id);
      if (intervals.size === 0) {
        intervalTracker.delete(component);
      }
      break;
    }
  }
};
**/
 // Cache frequently used regular expressions
const regexps = {
  onEventRegex: /on\w+="$/,
  tagMatchRegex: /<([^\s>/]+)[^>]*$/,
  attributeMatchRegex: /\s(\w+)=/g,
  routeTagRegex: /<\/?(?:route|router)\b/g
}
const globalProps = new Map();
export const AirComponent = (elementName, component) => {
  
  class CustomElement extends HTMLElement { 

    static usedPropIds = new Set();
    constructor() {
      super();
      
      //this.checkProps()
      this.routes = null;
      this.state = new Map();
      this.eventHandlers = new Map();
      this.onMountCallbacks = [];
      this.onUnMountCallbacks = [];
      this.isInitialRender = true;  // Flag to check if it's the first render
      this.psuedoStylesheet = ""
      this.previousVdom = null;
      this.currentVdom = null;
      this.focusElement = null;
      this.historyLength = 10
      this.timeWalk = false;
      //this.renderManager = new RenderManager;
      this.temporalHeap = null;
      this.temporalKeySet = new Set();
      this.strict = false;
      this.sheet = new CSSStyleSheet();
      this.childContent = null;
      this.intervals = new Set();  // Set to keep track of intervals
      //this.originalSetInterval = window.setInterval;
      //this.originalClearInterval = window.clearInterval;
      this.props = {}
    }
    static checkProps(element) {
      const id = element.getAttribute("air_props_id");
      if (id) {
        element.props = {...element.props, ...globalProps.get(id)};
        CustomElement.usedPropIds.add(id);
      }
    }
  
    static cleanProps() {
      globalProps.forEach((value, key) => {
        if (!CustomElement.usedPropIds.has(key) && !document.querySelector(`[air_props_id="${key}"]`)) {
          globalProps.delete(key);
        }
      });
      CustomElement.usedPropIds.clear();
    }
  
    static scheduleCleanup() {
      // Schedule cleanup for the next frame
      requestAnimationFrame(() => {
        CustomElement.cleanProps();
      });
    }
    setupIntervalTracking() {
      // Override setInterval
      window.setInterval = (...args) => {
        const id = this.originalSetInterval.apply(window, args);
        this.intervals.add(id);
        return id;
      };

      // Override clearInterval
      window.clearInterval = (id) => {
        this.originalClearInterval.call(window, id);
        this.intervals.delete(id);
      };
    }

    
    checkInnerHTML(){
      if (this.innerHTML && this.innerHTML.length > 0){
        const filtered = []
        Array.from(this.childNodes).forEach(node => {
          if (node.nodeName === "#text"){
            if (node.nodeValue.replace(/[\s\\]+/g, '').length === 0){
              return
            }else{
              filtered.push(node.nodeValue)
            }
           
          }else{
            filtered.push(node)
          }
        })
        this.props.children = filtered
      }
    }
    connectedCallback() {
      this.checkInnerHTML();
      document.adoptedStyleSheets = [...document.adoptedStyleSheets, this.sheet];
      
      
      setCurrentComponent(this);
      
      //this.setupIntervalTracking();
      
      const cleanupEffects = [];
      
      const cleanup = createEffect(async () => {
        setCurrentComponent(this);
        CustomElement.checkProps(this);  // Use static method to check props
        
        this.startTime = performance.now();
        
        if (this.isInitialRender) {
          const t = component.call(this, this.props);
          if (this.strict) {
            console.warn(`Strict Mode is enabled for component "${elementName}". All state variables must be invoked with parentheses (e.g., 'variable()') to ensure interactions with their actual values and not the proxy objects. This mode enforces strict syntax to prevent common proxy-related issues.`);
          }
          if (typeof t !== "function") {
            //throw new Error("Component must return a functional template.");
          }
          this.template = t;
          this.isInitialRender = false;
        }
  
        let focusPath = null;
        if (document.activeElement) {
          const activeEl = document.activeElement;
          focusPath = FocusManager.getPathToElement(activeEl);
          if (activeEl.tagName === "INPUT" && activeEl.getAttribute("type") === "text") {
            FocusManager.setFocusAttributes([{name:"selectionStart",value:activeEl.selectionStart}]);
          }
        }
        
        try {
          let result = null;
          typeof this.template === "function" ? result = this.template(this.props) : result = this.template;
          
          let { strings, values } = result;

          this.eventHandlers.clear();
          const processedTemplate = this.processTemplate(strings, values);
          //this.innerHTML = processedTemplate;
          if (this.previousVdom) {
            updateElement(this, processedTemplate);
          } else {
            this.innerHTML = processedTemplate;
          }
          this.attachEventListeners();
          this.previousVdom = processedTemplate;
        } catch (error) {
          console.error('Error in component rendering:', error);
        } finally {

        }

        this.endTime = performance.now();
        FocusManager.setFocusPath(focusPath);
        CustomElement.scheduleCleanup();  // Schedule cleanup after render  // Schedule cleanup after render
      });
   
      cleanupEffects.push(cleanup);
      this.cleanupEffects = cleanupEffects;
      //console.log("component: ", elementName, " mounted");
      this.triggerOnMount();
    }
    cleanupComponentDomPool() {
      const elementsToRelease = this.querySelectorAll('*');
      elementsToRelease.forEach(element => {
          const tagName = element.tagName.toLowerCase();
          const pool = domPool.get(tagName);
          if (pool) {
              const index = pool.indexOf(element);
              if (index !== -1) {
                  pool.splice(index, 1);
              }
          }
      });
  }
    attachEventListeners() {
      // Iterate over the event handlers
      this.eventHandlers.forEach((events, id) => {
        let targetElement = this.querySelector(`[${id}]`);
        // Iterate over each event for the current element
        events.forEach((event) => {
          if (targetElement) {
            try {
              targetElement[event.event] = event.handler
            }catch(e){
              console.log("error in event handler: ", e)
            }
          }
        });
        //targetElement.removeAttribute("air_event_id");
      });
    }

    disconnectedCallback() {
      // Clear styles
      document.adoptedStyleSheets = document.adoptedStyleSheets.filter(s => s !== this.sheet);
      
      /** 
      // Clear intervals
      const intervals = intervalTracker.get(this);
      if (intervals) {
        intervals.forEach(id => {
          originalClearInterval.call(window, id);
        });
        intervalTracker.delete(this);
      }
      */
      // Clear event handlers
      this.eventHandlers.clear();
      this.cleanupGlobalState();
      // Clear state
      this.state.clear();
  
      // Nullify references
      this.previousVdom = null;
      this.currentVdom = null;
      this.focusElement = null;
      this.childContent = null;
      this.props = null;
  
      // Clear temporal heap if it exists
      if (this.temporalHeap) {
        this.temporalHeap.clear();
      }
      // Clear event handlers
      this.eventHandlers.forEach((events, id) => {
        const element = this.querySelector(`[air_event_id="${id}"]`);
        if (element) {
          events.forEach(event => {
            element[event.event] = null;
          });
        }
      });
      this.eventHandlers.clear();
      // Run cleanup effects
      if (this.cleanupEffects) {
        this.cleanupEffects.forEach(cleanup => cleanup.cleanup && cleanup.cleanup());
      }
      this.cleanupComponentDomPool();
      this.cleanupSubscribers();
      // Run unmount callbacks
      this.triggerOnUnMount();
      this.cleanupEffects = null;
     
      allStates.forEach(state=>{
        state.removeComponentSubscribers(this)
        if (state.subscribers.size === 0){
          allStates.delete(state)
        }
      })
    }
    cleanupSubscribers() {
      // Clean up global state subscriptions
      if (componentStateMap.has(this)) {
        const globalStates = componentStateMap.get(this);
        globalStates.forEach(stateId => {
          const [stateProxy] = airGlobalStateHeap.get(stateId);
          stateProxy.state.removeComponentSubscribers(this);
        });
        componentStateMap.delete(this);
      }
  
      // Clean up local state subscriptions
      if (this.localStates) {
        this.localStates.forEach(state => {
          state.removeComponentSubscribers(this);
        });
        this.localStates.clear();
        this.localStates = null;
      }
    }
    cleanupGlobalState() {
      if (componentStateMap.has(this)) {
        const stateIds = componentStateMap.get(this);
        stateIds.forEach(id => {
          if (airGlobalStateHeap && airGlobalStateHeap.has(id)) {
            // Check if any other component is using this global state
            let isShared = false;
            if (!componentStateMap.entries || componentStateMap.entries?.length === 0) return;
            for (const [component, states] of componentStateMap.entries()) {
              if (component !== this && states.has(id)) {
                isShared = true;
                break;
              }
            }
            if (!isShared) {
              // If no other component is using this state, remove it from the global heap
              airGlobalStateHeap.delete(id);
            }
          }
        });
        componentStateMap.delete(this);
      }
    }
    updateStyles(styles) {
      this.sheet.insertRule(styles);
    }
    triggerOnUnMount = () => {
      if (this.onUnMountCallbacks.length > 0){
        this.onUnMountCallbacks.forEach(cb => cb())
      }else{
        //console.log(`Component ${elementName} unmounted`);
      }
    }
    triggerOnMount = () => {
      if (this.onMountCallbacks.length > 0){
        console.log(elementName, this.onMountCallbacks)
        this.onMountCallbacks.forEach(cb => {
          const returnFunc = cb()
          if (returnFunc && typeof returnFunc === "function"){
            this.onUnMountCallbacks.push(returnFunc)
          }else if (returnFunc && typeof returnFunc !== "function"){
            throw new Error("Invalid onMount callback. Expected function, got: " + typeof returnFunc)
          }
        })
      }else{
        //console.log(`Component ${elementName} mounted`);
      }

    };
    
    processTemplate(strings, values) {

      // Helper methods
      
      const isHtmlTemplate = (value) => typeof value === 'object' && value && value.htmlTemplate;
      const isEventHandler = (value, string) => typeof value === 'function' && regexps.onEventRegex.test(string);
      const isAirCssObject = (value) => typeof value === 'object' && value && value.$AirCss;
      const isPropsObject = (value, string) => typeof value === 'object' && string.endsWith("props=");
      
      

      const processEventHandler = (currentResult, value, attrName) => {
        const existingId = extractAttribute(currentResult, "air_event_id");
        const id = existingId || Math.random().toString(36).substring(2, 10).trim();
        const funcId = `air_event_id="${id}"`;
        const existing = this.eventHandlers.get(funcId) || [];
        this.eventHandlers.set(funcId, [...existing, {"event": attrName, "handler": value}]);
        
        // Remove the attribute name and the opening quote
        currentResult = currentResult.substring(0, currentResult.length - (attrName.length + 2));
        
        // If there's no existing ID, add it
        if (!existingId) {
          currentResult += `air_event_id="${id}"`;
        }
        // hmmmm need to think about this.
        currentResult = currentResult.trim().replace(/['"]$/, '');

        return currentResult;
      };
  
      const processFunctionValue = (currentResult, value, string) => {
        let renderedVar = value();
        if (isReactiveState(renderedVar)) {
          return currentResult + renderedVar.read;
        }
        if (isAirCssObject(renderedVar)) {
          const className = `air-css-${Math.random().toString(36).substring(2, 10).trim()}`
          const renderedCss = renderedVar.$AirCss(className);
          renderedCss.psuedo ? currentResult = addClassToLastUnclosedTag(currentResult, className) : currentResult;
          return currentResult + renderedCss.styles;
        }
        if (!renderedVar) {
          return currentResult + renderedVar;
        }
        if (isHtmlTemplate(renderedVar)) {
          return currentResult + this.processTemplate(renderedVar.strings, renderedVar.values);
        }
        return currentResult + renderedVar;
      };
  
      const processArrayValue = (currentResult, value) => {
        const d = [];
        processNestedArray(value, item => {
          if (item.htmlTemplate) {
            d.push(this.processTemplate(item.strings, item.values));
          }else if (item instanceof HTMLElement){
            d.push(item.outerHTML)
          }
          else{
            d.push(item)
          }
        });
        
        return currentResult + d.join("");
      };
  
      const processPropsObject = (currentResult, value, string, prevString) => {
        if (!string.includes("<")) {
          string = prevString + string;
        }
        const tagMatch = string.match(regexps.tagMatchRegex);
        let tagName = tagMatch ? tagMatch[1] : null;
        if (!tagName){
          tagName = currentResult.match(regexps.tagMatchRegex)[1] //this is a bit of a hack to get the tag name when the tagname text is in an expression like <{tagName}></div>
        }
        
        const isCustomElement = customElements.get(tagName) !== undefined || tagName === "route" || tagName === "router";
        if (isCustomElement) {
          const existingId = extractAttribute(currentResult, "air_props_id");
          const id = existingId || Math.random().toString(36).substring(2, 10).trim();
          const funcId = `air_props_id="${id}"`;
          const existing = globalProps.get(id);
          if (existing) {
            throw new Error("cannot initialise more than one properties object on a component.");
          }
          globalProps.set(id, value);
          return currentResult.replace("props=", funcId);
        }
        return currentResult;
      };
      function addClassToLastUnclosedTag(html, newClass) {
        const lastTagIndex = html.lastIndexOf('<');
        if (lastTagIndex === -1) return html;
      
        const beforeTag = html.slice(0, lastTagIndex);
        const tag = html.slice(lastTagIndex);
      
        if (tag.includes('class=')) {
          return beforeTag + tag.replace(/class=["']?([^"']*)["']?/, `class="$1 ${newClass}"`);
        } else {
          return beforeTag + tag.replace(/^<(\w+)/, `<$1 class="${newClass}"`);
        }
      }
      const extractAirAttribute = (str, attribute) => {
        const regex = new RegExp(`${attribute}="([^"]*)"`, 'gi');
        let match;
        let lastMatch = null;
        
        while ((match = regex.exec(str)) !== null) {
          lastMatch = match;
        }
        
        return lastMatch ? lastMatch[1] : null;
      }
      
      const processNestedArray = (array, action) => {
        array.forEach(item => {
            if (Array.isArray(item)) {
                // If the item is an array, recurse into it
                processNestedArray(item, action);
            } else {
                // If the item is not an array, perform the action
                action(item);
            }
        });
      }
      const processValue = (currentResult, value, string, prevString, attrName) => {

        if (isReactiveState(value)) {
          return currentResult + value.read;
        }
  
        if (value && value.isStateArray === true) {
          return currentResult + value.get();
        }
  
        if (isHtmlTemplate(value)) {
          return currentResult + this.processTemplate(value.strings, value.values);
        }
  
        if (isEventHandler(value, string)) {
          //console.log("string: ", string) 
          return processEventHandler(currentResult, value, attrName);
        }
  
        if (typeof value === 'function') {
          const res = processFunctionValue(currentResult, value, string);
          return res
        }
  
        if (Array.isArray(value)) {
          return processArrayValue(currentResult, value);
        }
  
        if (isPropsObject(value, string)) {
          return processPropsObject(currentResult, value, string, prevString);
        }
  
        if (isAirCssObject(value)) {

          const className = `air-css-${Math.random().toString(36).substring(2, 10).trim()}`
          const renderedCss = value.$AirCss(className);

          renderedCss.psuedo ? currentResult = addClassToLastUnclosedTag(currentResult, className) : currentResult;

          return currentResult + renderedCss.styles;
        }
        
        if (typeof value === 'object') {
          if (value instanceof HTMLElement){
            return currentResult + value.outerHTML;
          }
          return currentResult + JSON.stringify(value);
        }
        
        return currentResult + value;
      };

      // Main processTemplate logic
      const template = strings.reduce((result, string, i) => {

        let currentResult = result + string;
        
        if (i >= values.length) {
          return currentResult;
        }
  
        const value = values[i];
        const match = string.match(regexps.attributeMatchRegex);
        const attrName = match ? match[match.length - 1].trim().split('=')[0] : null;

        const res = processValue(currentResult, value, string, strings[i-1], attrName);
        
        return res;
      }, '');

      const r = template.replace(regexps.routeTagRegex, (match) => {
        switch (match) {
          case '<route': return '<air-route';
          case '</route': return '</air-route';
          case '<router': return '<air-router';
          case '</router': return '</air-router';
          default: return match;
        }
      });
      return r
    }
    
  }
  const lintWarnings = analyzeCode(component.toString(), component.strict)

  const invalid = Object.fromEntries(Object.entries(lintWarnings).map(([key, arr]) => [key, arr.filter(item => !item.valid)]));

  logErrors(invalid, component.strict)
  if (!customElements.get(elementName)){
    customElements.define(elementName, CustomElement);
  }else{
    console.log("component ", elementName, " already defined.")
  }
  
  return component;
};

export const strict = () => {
  currentComponent.strict = true
}

function extractAttribute(str, attribute) {
  const parts = str.split(/<(?!.*<)/); // Split at the last occurrence of <
  //console.log("parts: ", parts)
  const afterLastTag = parts[parts.length-1] || '';
  //console.log("afterLastTag: ", afterLastTag)
  const regex = new RegExp(`${attribute}="([^"]*)"`);
  const match = afterLastTag.match(regex);
  return match ? match[1] : null;
}

const MAX_POOL_SIZE = 1; // Adjust based on your needs
const domPool = new Map();

function getPooledElement(tagName) {
    if (!domPool.has(tagName)) {
        domPool.set(tagName, []);
    }
    const pool = domPool.get(tagName);
    return pool.pop() || document.createElement(tagName);
}

function releaseElement(element) {
    element.removeAttribute('key');
    element.innerHTML = '';
    // Remove all event listeners
    const clone = element.cloneNode(false);
    const tagName = clone.tagName.toLowerCase();
    const pool = domPool.get(tagName) || [];
    if (pool.length < MAX_POOL_SIZE) {
        pool.push(clone);
        domPool.set(tagName, pool);
    }
}

function cleanupDomPool() {
    for (const [tagName, pool] of domPool) {
        if (pool.length > MAX_POOL_SIZE) {
            domPool.set(tagName, pool.slice(0, MAX_POOL_SIZE));
        }
    }
}
//setInterval(cleanupDomPool, 60000); // Clean up every minute
function updateElement(targetElement, newHtmlString) {

  const newTemplate = targetElement.cloneNode(false);
  newTemplate.innerHTML = newHtmlString.replace(/\n/g, '');

  const isCustomElement = (() => {
    const cache = new Map();
    return (node) => {
        if (node.nodeType !== Node.ELEMENT_NODE) return false;
        const nodeName = node.nodeName.toLowerCase();
        if (cache.has(nodeName)) return cache.get(nodeName);
        const result = customElements.get(nodeName) !== undefined;
        cache.set(nodeName, result);
        return result;
    };
  })();

  function updateAttributes(current, updated) {
    if (!updated.attributes) {
        console.log("something wrong with attributes: ", current, updated);
        return;
    }
    const currentAttrs = current.attributes;
    const updatedAttrs = updated.attributes;

    for (let i = 0; i < updatedAttrs.length; i++) {
        
        const attr = updatedAttrs[i];

        if (current.getAttribute(attr.name) !== attr.value) {
            current.setAttribute(attr.name, attr.value);
        }
    }

    for (let i = currentAttrs.length - 1; i >= 0; i--) {
        const attr = currentAttrs[i];
        if (!updated.hasAttribute(attr.name)) {
            current.removeAttribute(attr.name);
        }
    }
  }

  function updateDom(current, updated, isRoot = false) {
    // Handle text node updates
    if (current.nodeType === Node.TEXT_NODE && updated.nodeType === Node.TEXT_NODE) {
        if (current.nodeValue !== updated.nodeValue) {
            current.nodeValue = updated.nodeValue;
        }
        return;
    }

    // Check if the current node or updated node is a custom element
    const currentIsCustom = isCustomElement(current);
    const updatedIsCustom = isCustomElement(updated);

    if (!isRoot && (currentIsCustom || updatedIsCustom)) {
        // If it's a custom element
        if (current.nodeName === updated.nodeName) {
          // check if the props have changed
          if (current.getAttribute("air_props_id")) {
            const currentProps = globalProps.get(current.getAttribute("air_props_id"));
            const updatedProps = globalProps.get(updated.getAttribute("air_props_id"));
            if (currentProps == updatedProps) {
              //if the props haven't changed, just update the attributes
              updateAttributes(current, updated);
              return
            }
          }
          // if the props have changed, replace the element
          const newElement = getPooledElement(updated.nodeName);
          updateAttributes(newElement, updated);
          current.parentNode.replaceChild(newElement, current);
          releaseElement(current);
          return;
        } else {
            // If it's a different type of custom element, replace it
            const newElement = getPooledElement(updated.nodeName);
            updateAttributes(newElement, updated);
            current.parentNode.replaceChild(newElement, current);
            releaseElement(current);
            return;
        }
    }

    // Replace the node if the type is different
    if (current.nodeName !== updated.nodeName) {
       
        const newElement = getPooledElement(updated.nodeName);
     
        updateAttributes(newElement, updated);
        newElement.innerHTML = updated.innerHTML;
        current.parentNode.replaceChild(newElement, current);
        releaseElement(current);
        return;
    }

    // Update attributes for elements
    if (current.nodeType === Node.ELEMENT_NODE) {
        updateAttributes(current, updated);
    }

    // Update child nodes
    const currentChildren = current.childNodes;
    const updatedChildren = updated.childNodes;
    let maxLength = Math.max(currentChildren.length, updatedChildren.length);

    for (let i = 0; i < maxLength; i++) {
        if (i >= currentChildren.length) {
            const newChild = updatedChildren[i].cloneNode(false);
            if (newChild.nodeType === Node.ELEMENT_NODE) {
                const pooledElement = getPooledElement(newChild.nodeName);
                updateAttributes(pooledElement, newChild);
                current.appendChild(pooledElement);
                updateDom(pooledElement, updatedChildren[i]);
            } else {
                current.appendChild(newChild);
            }
        } else if (i >= updatedChildren.length) {
            const removedChild = currentChildren[i];
            current.removeChild(removedChild);
            if (removedChild.nodeType === Node.ELEMENT_NODE) {
                releaseElement(removedChild);
            }
            i--; // Decrement i because the NodeList is live
            maxLength--;
        } else {
            updateDom(currentChildren[i], updatedChildren[i]);
        }
    }
}

  updateDom(targetElement, newTemplate, true);
}


export const airCss = (styles) => {
  const parse = (id) => {
    //console.log("airCss: ", styles)
    if (typeof styles === "function"){
      console.log("functional style: ") //hmmmm need to think about this.
    }
    let styleString = '';
    
    const processGroup = (group, properties) => {
      if (typeof properties !== "object"){
        if (isValidCSSProperty(group)){

          group = group.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
          if (typeof properties === "function"){
            properties = properties()
          }
        }
        //unary style like opacity. 
        styleString += `${group}: ${properties.toString().replaceAll('"',"'")}; `;
        //return
      }else{
        
        Object.keys(properties).forEach(property => {
        
          let value = properties[property];
  
          if (isReactiveState(value)){
  
            value = value
            //return
          }
          
          if (typeof value === 'function') {
  
            value = value();
          }
          if (group === "font" && property === "color"){
            styleString += `${property}: ${value.toString().replaceAll('"',"'")}; `;
          }else{
  
            styleString += `${group}-${property}: ${value.toString().replaceAll('"',"'")}; `;
          }
          
        });
      }
      
      
    };
    const processPsuedoElement = (group, properties) =>{

      if (!currentComponent){
        throw new Error("Invalid component context")
      }
      
      const styleRules = []
      
      Object.keys(properties).forEach(property => {
        let value = properties[property];
        if (typeof group === "string" && typeof property === "string" && group.startsWith("_")){}

        if (typeof value !== "object"){
          //unary
          if (isValidCSSProperty(property)){
            property = property.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
            if (typeof value === "function"){
              value = value()
            }

            styleRules.push({property, value})
          }

        }else{
          Object.keys(value).forEach(psuedoProperty=>{
            let psuedoValue = value[psuedoProperty]
              
            if (typeof psuedoValue === 'function') {
  
              psuedoValue = psuedoValue();
            }
            if (property === "font" && psuedoProperty === "color"){

              styleRules.push({property:psuedoProperty, value:psuedoValue})
            }if (group.startsWith("_")){
              styleRules.push({property:`${group}${property}-${psuedoProperty}`, value:psuedoValue})
            }
            else{
              
              styleRules.push({property:`${property}-${psuedoProperty}`, value:psuedoValue})

            }
          })
        }
        
      });

      if (styleRules.length>0){
        const cssRules = generatePseudoElementCSS(styleRules, id,  group.replace("_",""));
        
        cssRules.forEach(cssRule=>{
          currentComponent.updateStyles(cssRule)
        })
      }
      
    }
    const isValidCSSProperty = (property) => {
      // Convert camelCase to kebab-case
      const kebabCaseProperty = property.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
      
      // Check if the property is supported
      return CSS.supports(kebabCaseProperty, 'initial');
    }

    const generatePseudoElementCSS = (properties, id, pseudoElement) => {
      
      let cssRules = [];
      let mainProperties = [];
      let stackedProperties = {};
    
      // Separate main properties from stacked properties
      properties.forEach(prop => {
        if (prop.property.startsWith('_')) {
          let [stacked, ...rest] = prop.property.slice(1).split('-');
          let stackedPseudo = stacked.replace('_', ':');
          let actualProperty = rest.join('-');
          
          if (!stackedProperties[stackedPseudo]) {
            stackedProperties[stackedPseudo] = [];
          }
          stackedProperties[stackedPseudo].push({ property: actualProperty, value: prop.value });
        } else {
          mainProperties.push(prop);
        }
      });
    
      // Generate CSS for main pseudo-element
      if (mainProperties.length > 0) {
        let selector = `.${id}:${pseudoElement}`;
        let cssString = `${selector} {`;
        mainProperties.forEach(prop => {
          if (prop.property === 'content'){
            cssString += ` ${prop.property}: "${prop.value}" !important;`;
          }else{
            cssString += ` ${prop.property}: ${prop.value} !important;`;
          }
        });
        cssString += ' }';
        cssRules.push(cssString);
      }
    
      // Generate CSS for stacked pseudo-elements
      for (let [stackedPseudo, props] of Object.entries(stackedProperties)) {
        let selector = `.${id}:${stackedPseudo}`;
        let cssString = `${selector} {`;
        props.forEach(prop => {
          cssString += ` ${prop.property}: ${prop.value} !important;`;
        });
        cssString += ' }';
        cssRules.push(cssString);
      }
    
      return cssRules;
    };
    let psuedo = false
    Object.keys(styles).forEach(group => {
        if (!group.startsWith("_")){
          processGroup(group, styles[group]);
        }else{
          psuedo = true
         
          processPsuedoElement(group, styles[group])
        }
        

    });
    return {styles:styleString.trim(),psuedo}
  };

  return ()=>{return{"$AirCss":(id) => parse(id)}}
};

export const keyframes = (animation) => {
  const id = Math.random().toString(36).substring(2, 10).trim();
  
  const convertToCSSString = (obj) => {
    return Object.entries(obj)
      .map(([prop, value]) => `${prop.replace(/[A-Z]/g, m => '-' + m.toLowerCase())}: ${value};`)
      .join(' ');
  };

  const cssString = `@keyframes ${id} {
    ${Object.entries(animation)
      .map(([key, value]) => `${key} { ${convertToCSSString(value)} }`)
      .join('\n    ')}
  }`;

  const sheet = new CSSStyleSheet();
  sheet.replaceSync(cssString);

  if (typeof document !== 'undefined' && document.adoptedStyleSheets) {
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
  }
  
  return (options)=>{
    return `${id} ${options}`
  };
};
let routes = [];
const [currentPath, setCurrentPath] = createState(window.location.pathname);
const handleNavigation = (event) => {
  event.preventDefault();
  const path = event.target.getAttribute('href');
  window.history.pushState({}, '', path);
  setCurrentPath(path);
};
function matchPath(path) {
  for (let route of routes) {
      // Create an array of all valid paths for the route, including aliases
      let pathsToMatch = [route.path];
      if (route.aliases) {
          pathsToMatch = pathsToMatch.concat(route.aliases);
      }

      for (let pathToMatch of pathsToMatch) {
          const routeParts = pathToMatch.split('/');
          const pathParts = path.split('/');

          if (routeParts.length !== pathParts.length) {
              continue;
          }

          let isMatch = true;
          let params = {};

          for (let i = 0; i < routeParts.length; i++) {
              if (routeParts[i].startsWith(':')) {
                  params[routeParts[i].substring(1)] = pathParts[i];
              } else if (routeParts[i] !== pathParts[i] && routeParts[i] !== '*') {
                  isMatch = false;
                  break;
              }
          }

          if (isMatch) {
              return { ...route, params };
          }
      }
  }

  return null; // No match found
}

const AirRouter = AirComponent('air-router', function(RouterProps) {

  window.addEventListener('popstate', () => {
    setCurrentPath(window.location.pathname);
  });

  const currentRoute = () => {
    const xmatch = matchPath(currentPath()) || routes.find(route => route.path === '*');
    if (typeof xmatch.component !== 'string') {
      throw new Error(`Invalid route component. Expected string, got: ${typeof xmatch.component}, please use the registered name of the component.`);
    }
    return xmatch;
  };
  
  return () => {
    const route = currentRoute();
    const componentName = route && route.component ? route.component : '';
    const routeParams = route ? route.params : {};
    // Render
    return html`
         <${componentName} props=${{ RouteParams: routeParams, RouterProps }}></${componentName}>

    `;
  };
});


const AirRoute = AirComponent('air-route', function(props) {
  return () => html`
    <a href="${this.getAttribute("href")}" onclick="${handleNavigation}">${props.children}</a>
  `;
});

export const Router = {
  Router: AirRouter,
  Routes: (newRoutes) => {
    const flattenRoutes = (routes, parentPath = '') => 
      routes.flatMap(route => {
        const fullPath = parentPath ? `${parentPath}/${route.path}` : route.path;
        const flattenedRoute = { ...route, path: fullPath };
        delete flattenedRoute.children;
  
        if (route.children) {
          return [flattenedRoute, ...flattenRoutes(route.children, fullPath)];
        }
  
        return flattenedRoute;
      });
  
    // Flatten all routes including the top-level ones
    routes = flattenRoutes(newRoutes);
  },
  Route:AirRoute
}

class QueryCache {
  constructor() {
    this.queries = new Map();
    this.queryIntervals = new WeakMap();
  }

  setQuery(queryKey, data, options = {}) {
    const { cacheTime = 5 * 60 * 1000, staleTime = 0 } = options;
    this.queries.set(queryKey, {
      data,
      timestamp: Date.now(),
      cacheTime,
      staleTime,
    });
  }

  getQuery(queryKey) {
    const query = this.queries.get(queryKey);
    if (!query) return null;

    const now = Date.now();
    if (now - query.timestamp > query.cacheTime) {
      this.queries.delete(queryKey);
      return null;
    }

    return query;
  }

  invalidateQueries(predicate) {
    for (const [key, query] of this.queries.entries()) {
      if (predicate(query, key)) {
        this.queries.delete(key);
      }
    }
  }

  clear() {
    this.queries.clear();
  }

  setQueryInterval(component, queryKey, intervalId) {
    if (!this.queryIntervals.has(component)) {
      this.queryIntervals.set(component, new Map());
    }
    this.queryIntervals.get(component).set(queryKey, intervalId);
  }

  clearQueryIntervals(component) {
    const intervals = this.queryIntervals.get(component);
    if (intervals) {
      intervals.forEach(intervalId => clearInterval(intervalId));
      this.queryIntervals.delete(component);
    }
  }
}

const queryCache = new QueryCache();

export const createQuery = (queryKey, queryFn, options = {}) => {
  const { cacheTime = 5 * 60 * 1000, staleTime = 0, refetchInterval } = options;
  const [data, setData] = createState(null);
  const [isLoading, setIsLoading] = createState(true);
  const [error, setError] = createState(null);

  const fetchData = async (isRefetch = false) => {
    if (!isRefetch) setIsLoading(true);
    setError(null);
    try {
      const result = await queryFn();
      setData(result);
      queryCache.setQuery(queryKey, result, { cacheTime, staleTime });
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Check cache or fetch data
  const cachedQuery = queryCache.getQuery(queryKey);
  if (cachedQuery) {
    setData(cachedQuery.data);
    setIsLoading(false);
    if (Date.now() - cachedQuery.timestamp > cachedQuery.staleTime) {
      fetchData(true);
    }
  } else {
    fetchData();
  }

  // Set up refetch interval if specified
  if (refetchInterval) {
    const intervalId = setInterval(() => fetchData(true), refetchInterval);
    queryCache.setQueryInterval(currentComponent, queryKey, intervalId);

    // Clean up interval on component unmount
    onUnMount(() => {
      clearInterval(intervalId);
      queryCache.clearQueryIntervals(currentComponent);
    });
  }

  const refetch = () => fetchData(true);

  return { data, isLoading, error, refetch };
};

export const invalidateQueries = (predicate) => queryCache.invalidateQueries(predicate);
export const clearQueryCache = () => queryCache.clear();