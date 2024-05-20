const elementBindings = new Map();
const processHtml = (strings, values) => {
  console.log("strings: ", strings)
  console.log("values: ", values)
  const result = strings.reduce((result, str, i) => {
    console.log("result at start of clean: ", result)
    let value = values[i];
    if (typeof value === "function") {
      console.log("here, function")
      // Extract attribute name from static content
      const match = str.match(/\s(\w+)=/g);
      const attrName = match ? match[match.length - 1].trim().split('=')[0] : null;
      const existingId = getLastElemId(result);
      let id
      if (!existingId){
          id =  Math.random().toString(36).slice(2, 15);
      }else{
          id = existingId
      }

      const existing = elementBindings.get(id) || { attributes: [], content: [], handlers: [] };
      console.log("existing elem id1: ", id)

      // Handle attribute binding

      if (attrName && attrName.startsWith("on")) {
        
        console.log("adding handler: ", attrName)
        console.log("current string total", result)
        
        console.log("existing: ", existing)
        console.log("new entry: ", [attrName, value])
        existing.handlers.push([attrName, value]);
        elementBindings.set(id, existing);
        if (!existingId){
            value = `data-elem-id="${id}"`;
        }else{
            value = null
        }
        
        str = str.replace(`${attrName}=`, "");
        //return result + str + value;
      }else if(attrName){
          
          existing.attributes.push([attrName, value]);
          if (!existingId){
            value = `data-elem-id="${id}"`;
            }else{
                value = null
            }
          str = str.replace(`${attrName}=`, "");
      } else {
        console.log("here, random span value")
        str += `<span data-elem-id="${id}">${value()}</span>`;
        value = null
        existing.content.push([value]);
        elementBindings.set(id, existing);
      }
    } else if (Array.isArray(value)) {
      const joined = []
      value.forEach(item=>{
        joined.push(item.result)
      })
      console.log("here, array: ", joined)
      value = joined.join('');
    }

    return result + str + (value || '');
  }, '');
    console.log("element bindings: ", elementBindings)
  return {result, elementBindings};

};
function getLastElemId(htmlString) {
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
  
export default processHtml;