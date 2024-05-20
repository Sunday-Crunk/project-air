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