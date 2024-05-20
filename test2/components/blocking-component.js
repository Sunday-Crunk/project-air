import { AirComponent, createState, html, airCss } from '../air-js/core/air.js';
export const SlowComponent = AirComponent('slow-component', function({count, thisprop}) {
    console.log(count, thisprop)
    const blockingCall = (callback) => {
      // Simulate a blocking call
      const start = Date.now();
      while (Date.now() - start < 1000) {
        // Block for 100ms
        
      }
      callback()
    };
    this.props.count.onUpdate(e=>blockingCall(()=>{
      console.log("i blocked")
      this.props.setCount(this.props.count+1)
    }))
    //blockingCall(); // Introduce blocking call during render
    return () => {
      
  
      return html`
        <div>This component is slow. ${this.props.count}</div>
      `;
    };
  });
export const StylishCounter = AirComponent('stylish-counter', function() {
  const [count, setCount] = createState(0);

  const theme = {
    colors: {
      primary: '#3498db',
      secondary: '#2ecc71',
      background: '#ecf0f1',
      font: '#2c3e50'
    },
    fontSize: '18pt',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)'
  };

  const styles = {
    container: airCss({
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: theme.padding,
      border: `2px solid ${theme.colors.primary}`,
      borderRadius: theme.borderRadius,
      backgroundColor: theme.colors.background,
      boxShadow: theme.boxShadow,
      transition: 'transform 0.2s',
      ':hover': {
        transform: 'scale(1.05)'
      }
    }),
    button: airCss({
      backgroundColor: theme.colors.primary,
      color: '#fff',
      border: 'none',
      padding: '10px 20px',
      fontSize: theme.fontSize,
      borderRadius: theme.borderRadius,
      cursor: 'pointer',
      margin: '10px 0',
      transition: 'background-color 0.3s',
      ':hover': {
        backgroundColor: theme.colors.secondary
      }
    }),
    count: airCss({
      fontSize: '24pt',
      color: theme.colors.font,
      margin: '10px 0'
    })
  }; 

   

  return () => {


    return html`
      <div style="${styles.container}">
        <h1 style="${styles.count}">${count*2}</h1>
        <button style="${styles.button}" onclick="${() => setCount(count + 1)}">Increment</button>
        <slow-component props=${{count, setCount, "thisprop": "me", thatprop: "excited"}}></slow-component>
      </div>
      
    `;
  };
});



