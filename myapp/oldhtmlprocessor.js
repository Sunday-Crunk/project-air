

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
  
  
  