const htmlProcessor = (currentComponent,state,strings, ...values) => {
  
  const template = document.createElement('template');
  const processed = processHtml(strings, values,currentComponent, state);
  console.log("processed html: ", processed);

  template.innerHTML = processed;
  return processed;
};

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


const processHtml = (strings, values, component, state) => {
  
  //const { styleMap, attributeMap } = componentStateHandlers || {};
  //if (!styleMap || !attributeMap) throw new Error("State handlers are missing.");
  //strings = tagStatefulAttributeElements(strings,componentStateHandlers, values);
  console.log("string: ", strings.join(""))
  console.log("component : ", component)
  console.log("component state: ", state)
  const processValue = (value,prevValue,leaderChar, currentString, prevString) => {
    // Extract attribute name from static content
    const match = currentString.match(/\s(\w+)=/g);
    const attrName = match ? match[match.length - 1].trim().split('=')[0] : null;
    const id = Math.random().toString(36).slice(2, 15);
    const existing = state.elements.get(id) || { attributes: [], content: [], handlers: [], styles:[] };
    //value.elementIds = [...elementIds, id] || [];
    console.log("processing an expression value.: ", {value, leaderChar})
    if (Array.isArray(value)) {
      value = value.join('');
    }else if (attrName && attrName.startsWith("on")) {
      existing.handlers.push([attrName, value]);
      state.elements.set(id, existing);
      value = `data-elem-id="${id}"`;
      currentString = currentString.replace(`${attrName}=`, "");
  } else if (attrName) {
      existing.attributes.push([attrName, value]);
      value = `data-elem-id="${id}"`;
      currentString = currentString.replace(`${attrName}=`, "");
  } else {
      currentString += `<span data-elem-id="${id}">${value()}</span>`;
      existing.content.push([value]);
      state.elements.set(id, existing);
      value = null;
  }
  return currentString + (value || '');
  };

  const composedHtml = strings.reduce((result, currentString, index) => {
    const leaderChar = index > 0 ? strings[index - 1].slice(-1) : '';
    const processedValue = index > 0 ? processValue(values[index - 1], values[index - 2],leaderChar, currentString,index - 1) : '';
    return result + processedValue;
  }, '');

  //return cleanStyle(composedHtml, styleMap);
  return composedHtml
};

export default htmlProcessor;