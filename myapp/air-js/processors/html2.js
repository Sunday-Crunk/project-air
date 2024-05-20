
  const getLastAttribute = str => {
    const match = /(\w+)=$/.exec(str);
    return match ? match[1] : null;
  };
  
  const tagStatefulAttributeElements = (strings, componentStateHandlers, expressions) => {
    const uniqueIdGenerator = () => Math.random().toString(36).slice(2, 15);
    const separator = '\uE000';
    const stateHandlers = componentStateHandlers;
  
    let expressionIndex = 0;
    strings = strings.join(separator).replace(/<(\w+)(\s*[^>]*)>/g, (match, tagName, existingAttributes) => {
        // Determine if the element has expressions
        console.log("data: ", match, tagName, existingAttributes)
        const hasExpressions = expressions.slice(expressionIndex).some(expression => expression != null);
        console.log("has expressions?: ", hasExpressions)
        // If no expressions are associated with this element, return it as-is
        if (!hasExpressions) {
            return match;
        }
  
        const uniqueId = uniqueIdGenerator();
        stateHandlers.attributeMap.set(uniqueId, []);
  
        return `<${tagName} air-state-id="${uniqueId}"${existingAttributes}>`;
    });
  
    return strings.split(separator);
  };
  
  
  
  
  const getLastAirStateId = (html) => {
    const matches = html.match(/air-state-id="([^"]+)"/g);
    return matches ? matches[matches.length - 1].match(/"([^"]+)"/)[1] : null;
  }
  const extractCSSPropertyName = (styleString) => {
    // Use `matchAll()` to find all matches and convert the iterator to an array
    const matches = Array.from(styleString.matchAll(/(?:^|[";\s])([\w-]+)\s*:(?!=)/g));
    // Check if matches exist and return the last match's first capturing group
    return matches.length ? matches[matches.length - 1][1] : '';
  }
  const cleanStyle = (html, styleMap) =>{
    // Construct a regex pattern from styleMap to directly target and remove specified styles with semicolons
    const regexPattern = Array.from(styleMap, ([[ , stateValue], [{property, extension}]]) => 
        `${property}\\s*:\\s*${stateValue}${extension}\\s*;?`
    ).join('|');
    const styleRegex = new RegExp(regexPattern, 'g');
  
    // Efficiently clean style attributes in the HTML string
    return html.replace(/style="([^"]*?)"/g, (match, styleContent) => {
        // Remove the targeted styles using the regex
        let cleanedStyle = styleContent.replace(styleRegex, '').trim();
  
        // Remove any leading, trailing, or multiple semicolons
        cleanedStyle = cleanedStyle.replace(/^;+|;+$/g, '').replace(/;\s*;/g, ';');
  
        // Return the modified style attribute or remove it entirely if empty
        return cleanedStyle ? `style="${cleanedStyle}"` : '';
    });
  }
  
  const processHtmlOld = (strings, values, componentStateHandlers, component) => {
  
    const { styleMap, attributeMap } = componentStateHandlers || {};
    if (!styleMap || !attributeMap) throw new Error("State handlers are missing.");
    //strings = tagStatefulAttributeElements(strings,componentStateHandlers, values);
    console.log("string: ", strings.join(""))
    const processValue = (value,prevValue,leaderChar, currentString, prevString) => {
      if (Array.isArray(value)) {
        value = value.join('');
      }
      if (typeof value !== 'function') {console.log("yo: ", value);return value};
      const elementAirId = getLastAirStateId(strings.slice(0, prevString + 1).join(''));
      if (value.origin === 'createState') {
        if (leaderChar === ':') {
          console.log("value: ", value(), "leader: ", leaderChar, "& style data")
          const propertyName = extractCSSPropertyName(strings[prevString]);
          const propertyExtension = currentString.split(';')[0];
          const stylePropertyData = { property: propertyName, value, extension: propertyExtension };
          styleMap.set([elementAirId, value.id], (styleMap.get([elementAirId, value.id]) || []).concat(stylePropertyData));
          return `${value.id}`;
        } else if (leaderChar === '=' && !strings[prevString].includes("style=")) {
          console.log("value: ", value(), "leader: ", leaderChar, "& attribute data")
          const attrName = getLastAttribute(strings[prevString]);
          attributeMap.set(elementAirId, [...(attributeMap.get(elementAirId) || []), { stateId: value.id, attrName, value: value() }]);
          return `"${value()}"`;
        } else {
          console.log("value: ", value(), "leader: ", leaderChar, "& span data")
          return `<span air-data-state="${value.id}">${value()}</span>`;
        }
      } else if (!value.origin) {
        component.addEventHandler(prevString, value);
        return `placeholder-for-event-${prevString}`;
      } else {
  
        return value();
      }
    };
  
    const composedHtml = strings.reduce((result, currentString, index) => {
      const leaderChar = index > 0 ? strings[index - 1].slice(-1) : '';
      const processedValue = index > 0 ? processValue(values[index - 1], values[index - 2],leaderChar, currentString,index - 1) : '';
      return result + (processedValue + currentString);
    }, '');
  
    return cleanStyle(composedHtml, styleMap);
  };
  
  const getLastElemId = (htmlString) => {
    // Regular expression to match the last unclosed element with a data-elem-id
    const regex = /<(\w+)\s[^>]*data-elem-id="([a-z0-9]+)"[^>]*$/i;

    // Execute the regex on the input string
    const match = regex.exec(htmlString);

    // Return the data-elem-id if match is found
    if (match) {
        return match[2];
    }

    // Return null if no unclosed element with data-elem-id is found
    return null;
    }
    const wrapValue = (v, id) => {
        const fn = () => v;
        fn.id = id;
        return fn;
    };
    const processHtml = (strings, values, component, state) => {
        const processValue = (value, leaderChar, currentString, result, index) => {
          const match = currentString.match(/\s(\w+)=/g);
          const attrName = match ? match[match.length - 1].trim().split('=')[0] : null;
          const existingId = getLastElemId(result+currentString);
          let id = existingId || Math.random().toString(36).slice(2, 15);
          if (!existingId){
            //console.log("no existing id found in current element, searched the result string: ", result)
            //console.log("generated a new id: ", id)
          }else{
            //console.log("allegedly found an existing id in result string: ", result)
            //console.log("what if we added the nexString?: ", result+strings[index])
          }
          const existing = state.elements.get(id) || { attributes: [], content: [], events: [], styles: [], maps: [] };
          //modify to track dependencies of items and add the parent value id
          if (value === undefined) return currentString
          if (typeof value === "function") console.log("func value: ", value.toString());
          if (attrName && attrName.startsWith("on")) {
            existing.events.push([attrName, value]);
            state.elements.set(id, existing);
            value = value && value.id ? `data-elem-id="${id}" air-state-id="${value.id}"` : `data-elem-id="${id}"`;
            currentString = currentString.replace(`${attrName}=`, "");
          } else if (attrName) {
            existing.attributes.push([attrName, value]);
            state.elements.set(id, existing);
            value = value && value.id ? `data-elem-id="${id}" air-state-id="${value.id}"` : `data-elem-id="${id}"`;
            currentString = currentString.replace(`${attrName}=`, "");
          } else if (value?.tag ==="mappedFunction") {
            console.log("map resolver: ", value)
            console.log("map callback: ", value.callback)
            const resolved = value()
            console.log("resolved: ", resolved)
            existing.maps.push([{id:value.id, map: value.callback}]);
            value = `<span ${value && value.id ? `air-state-id="${value.id}"` : ''} data-elem-id="${id}">${resolved.join('')}</span>`;
            state.elements.set(id, existing);
          } else {
            let cleanV
            if (typeof value === "function"){
                cleanV = value()
            }else{
                cleanV = value
            }


            currentString += `<span ${value && value.id ? `air-state-id="${value.id}"` : ''} data-elem-id="${id}">${cleanV}</span>`;
            existing.content.push([value]);
            state.elements.set(id, existing);
            value = null;
          }
          return currentString + (value || '');
        };
      
        const result = strings.reduce((result, currentString, index) => {
          const leaderChar = index > 0 ? strings[index - 1].slice(-1) : '';
          const processedValue = processValue(values[index], leaderChar, currentString, result, index)
          console.log("adding this to full string: ", processedValue)
          return result + processedValue
        }, '');
        console.log("processed html: ", result)
        const template = document.createElement("template");
        template.innerHTML = result;
        return result;
      };
      

  function clean(strings, ...values) {
    const result = strings.reduce((result, str, i) => {
        let value = values[i];
        if (typeof value === "function") {
            // Extract attribute name from static content
            const match = str.match(/\s(\w+)=/g);
            const attrName = match ? match[match.length - 1].trim().split('=')[0] : null;
            const id = Math.random().toString(36).slice(2, 15);
            const existing = elementBindings.get(id) || { attributes: [], content: [], handlers: [] };

            // Handle attribute binding
            if (attrName && attrName.startsWith("on")) {
                existing.handlers.push([attrName, value]);
                elementBindings.set(id, existing);
                value = `data-elem-id="${id}"`;
                str = str.replace(`${attrName}=`, "");
            } else if (attrName) {
                existing.attributes.push([attrName, value]);
                value = `data-elem-id="${id}"`;
                str = str.replace(`${attrName}=`, "");
            } else {
                str += `<span data-elem-id="${id}">${value()}</span>`;
                existing.content.push([value]);
                elementBindings.set(id, existing);
                value = null;
            }
        } else if (Array.isArray(value)) {
            value = value.join('');
        }

        return result + str + (value || '');
    }, '');

    return result;
}
  
  export default processHtml;