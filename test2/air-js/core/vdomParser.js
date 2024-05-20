export class HTMLParser {
    constructor() {
        this.index = 0;
        this.stack = [{ type: "ROOT", children: [] }];  // Root element to handle top-level nodes
        this.html = "";
    }

    parse(html) {
        this.html = html;
        while (this.index < this.html.length) {
            if (this.html[this.index] === '<' && this.html[this.index + 1] !== '/') {
                this.parseElement();
            } else if (this.html[this.index] === '<' && this.html[this.index + 1] === '/') {
                this.parseClosingTag();
            } else {
                this.parseText();
            }
        }
        return this.stack[0].children;  // Return the children of the root node
    }

    parseElement() {
        this.index++;  // Skip '<'
        const tagName = this.readTagName();
        const element = { type: tagName, props: {}, children: [] };

        // Read properties
        while (this.html[this.index] !== '>') {
            if (this.html[this.index] === ' ' || this.html[this.index] === '\n' || this.html[this.index] === '/') {
                this.index++;
            } else if (this.html[this.index] !== '>') {
                const { name, value } = this.readProp();
                element.props[name] = value;
            }
        }
        this.index++;  // Skip '>'

        if (!["input", "br", "hr"].includes(tagName)) {  // Handle non-self-closing tags
            this.stack.push(element);
        } else {
            this.appendChildren(element);
        }
    }

    readTagName() {
        let name = '';
        while (/[a-z0-9]/i.test(this.html[this.index])) {
            name += this.html[this.index++];
        }
        return name;
    }

    readProp() {
        let name = '';
        let value = '';
        let inValue = false;

        // Read the attribute name
        while (this.html[this.index] !== '=' && this.html[this.index] !== '>' && this.html[this.index] !== ' ' && this.html[this.index] !== '/') {
            name += this.html[this.index++];
        }

        if (this.html[this.index] === '=') {
            this.index++; // Skip '='
            // Check the next character if it is a quote
            const quote = this.html[this.index];
            if (quote === '"' || quote === "'") {
                this.index++; // Skip the opening quote
                while (this.html[this.index] !== quote) {
                    value += this.html[this.index++];
                }
                this.index++; // Skip the closing quote
            }
        }

        return { name, value };
    }

    parseText() {
        let text = '';
        while (this.index < this.html.length && this.html[this.index] !== '<') {
            text += this.html[this.index++];
        }
        text = text.trim();
        if (text) {
            const textElement = {
                type: "TEXT_ELEMENT",
                props: { nodeValue: text },
                children: null
            };
            this.appendChildren(textElement);
        }
    }

    parseClosingTag() {
        this.index += 2; // Skip '</'
        const tagName = this.readTagName();
        while (this.html[this.index] !== '>') {
            this.index++;
        }
        this.index++; // Skip '>'
        if (this.stack[this.stack.length - 1].type === tagName) {
            const element = this.stack.pop();
            this.appendChildren(element);
        }
    }

    appendChildren(element) {
        const parent = this.stack[this.stack.length - 1];
        parent.children.push(element);
    }
}

export class HTMLParserX {
    constructor() {
        this.index = 0;
        this.stack = [];
        this.html = "";
        this.tagNamePattern = /[a-z0-9]/i;
    }

    parse(html) {
        this.html = html
        while (this.index < this.html.length) {
            if (this.html[this.index] === '<' && this.html[this.index + 1] !== '/') {
                this.parseElement();
            } else if (this.html[this.index] === '<' && this.html[this.index + 1] === '/') {
                this.parseClosingTag();
            } else {
                this.parseText();
            }
        }
        return this.stack[0];
    }

    parseElement() {
        const element = { props: {}, children: [] };
        this.index += 1;  // Skip '<'
        const tagName = this.readTagName();
        element.type = tagName;

        // Read properties
        while (this.html[this.index] !== '>') {
            if (this.html[this.index] === ' ') {
                this.index++;
            } else {
                const { name, value } = this.readProp();
                element.props[name] = value;
            }
        }
        this.index++;  // Skip '>'

        const selfClosingTags = new Set(["input", "br", "img", "meta", "link", "hr"]);

        if (!selfClosingTags.has(tagName)) {
            this.stack.push(element);
        } else {
            this.appendChildren(element);
        }
    }

    readTagName() {
        let name = [];
        while (this.index < this.html.length && this.tagNamePattern.test(this.html[this.index])) {
            name.push(this.html[this.index++]);
        }
        return name.join('');
    }

    readProp() {
        let name = [];
        let value = [];
        let inValue = false;

        while (this.html[this.index] !== '>' && this.html[this.index] !== ' ') {
            if (this.html[this.index] === '=') {
                inValue = true;
                this.index++; // skip '='
                this.index++; // skip '"'
                continue;
            }

            if (!inValue) {
                name.push(this.html[this.index]);
            } else {
                if (this.html[this.index] === '"') {
                    this.index++; // skip closing '"'
                    break;
                }
                value.push(this.html[this.index]);
            }
            this.index++;
        }
        return { name:name.join(""), value:value.join("") };
    }

    parseText() {
        let text = '';
        while (this.html[this.index] !== '<') {
            text += this.html[this.index++];
        }
        text = text.trim();
        if (text) {
            const textElement = {
                type: "TEXT_ELEMENT",
                props: { nodeValue: text },
                children: null
            };
            this.appendChildren(textElement);
        }
    }

    parseClosingTag() {
        this.index += 2;  // Skip '</'
        while (this.html[this.index] !== '>') {
            this.index++;
        }
        this.index++;  // Skip '>'
        const element = this.stack.pop();
        this.appendChildren(element);
    }

    appendChildren(element) {
        if (this.stack.length > 0) {
            const parent = this.stack[this.stack.length - 1];
            parent.children.push(element);
        } else {
            this.stack.push(element);
        }
    }
}
export class domVersionParser {
    constructor() {

    }
    // This would normally run in an environment where DOM parsing is available
    parseHTMLtoVDOM(html) {
        this.parser = new DOMParser();
        this.doc = this.parser.parseFromString(html, 'text/html');
        const vdom = this.createElement(this.doc);
        return vdom;
    }

    createElement(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            return node.textContent;
        }

       const element = {
            type: node.tagName?.toLowerCase(),
            props: {},
            children: [],
        };

        if (node && node.attributes){
            for (const attr of node?.attributes) {
                element.props[attr.name] = attr.value;
            }
        }
        

        // Children
        node.childNodes.forEach(child => {
            element.children.push(this.createElement(child));
        });

        return element;
    }

}
export class omegaParse {
    constructor() {
        this.stack = [];
        this.currentNode = null;
        this.state = "TEXT";
        this.buffer = "";
    }

    parse(html) {
        for (let i = 0, len = html.length; i < len; i++) {
            const char = html[i];
            switch (this.state) {
                case "TEXT":
                    if (char === '<') {
                        if (this.buffer.trim().length) {
                            this.handleText(this.buffer.trim());
                        }
                        this.buffer = "";
                        if (html[i+1] === '/') {
                            this.state = "CLOSE_TAG";
                            i++; // Skip '/'
                        } else {
                            this.state = "READ_TAG_NAME";
                        }
                    } else {
                        this.buffer += char;
                    }
                    break;
                case "READ_TAG_NAME":
                    if (char.match(/[a-z0-9]/i)) {
                        this.buffer += char;
                    } else {
                        this.handleTagName(this.buffer);
                        this.buffer = "";
                        if (char === '>') {
                            this.state = "TEXT";
                        } else {
                            this.state = "READ_ATTR_NAME";
                        }
                    }
                    break;
                case "READ_ATTR_NAME":
                    if (char === '=') {
                        this.currentAttr = this.buffer;
                        this.buffer = "";
                        this.state = "READ_ATTR_VALUE";
                    } else if (char === '>') {
                        this.state = "TEXT";
                    } else if (!char.trim().length) {
                        // Space, handling completed attribute with no value
                        if (this.buffer) {
                            this.currentNode.props[this.buffer] = true;
                            this.buffer = "";
                        }
                    } else {
                        this.buffer += char;
                    }
                    break;
                case "READ_ATTR_VALUE":
                    if (char === '"') {
                        if (this.buffer[0] === '"') { // Closing quote
                            this.currentNode.props[this.currentAttr] = this.buffer.slice(1);
                            this.buffer = "";
                            this.state = "READ_ATTR_NAME";
                        } else { // Opening quote
                            this.buffer += char;
                        }
                    } else {
                        this.buffer += char;
                    }
                    break;
                case "CLOSE_TAG":
                    if (char === '>') {
                        this.handleClosingTag();
                        this.state = "TEXT";
                    }
                    break;
            }
        }
        if (this.buffer.trim().length && this.state === "TEXT") {
            this.handleText(this.buffer.trim());
        }
        return this.stack[0];
    }

    handleText(text) {
        const textElement = {
            type: "TEXT_ELEMENT",
            props: { nodeValue: text },
            children: []
        };
        this.appendChildren(textElement);
    }

    handleTagName(tagName) {
        const element = { type: tagName, props: {}, children: [] };
        this.stack.push(element);
        this.currentNode = element;
    }

    handleClosingTag() {
        const element = this.stack.pop();
        this.appendChildren(element);
    }

    appendChildren(element) {
        if (this.stack.length > 0) {
            this.stack[this.stack.length - 1].children.push(element);
        }
    }
}