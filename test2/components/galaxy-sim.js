import { AirComponent, createState, html, airCss } from '../air-js/core/air.js';

export const GalaxySimulator = AirComponent('galaxy-simulator', function() {
  const [stars, setStars] = createState([]);
  const [galaxyCenter, setGalaxyCenter] = createState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  const NUM_STARS = 300;
  const MAX_RADIUS = Math.min(window.innerWidth, window.innerHeight) / 2;

  const generateGalaxy = () => {
    console.log('Generating galaxy...');
    const newStars = Array.from({ length: NUM_STARS }, () => {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.sqrt(Math.random()) * MAX_RADIUS;
      return {
        id: Math.random().toString(36).substring(7),
        x: galaxyCenter.x + radius * Math.cos(angle),
        y: galaxyCenter.y + radius * Math.sin(angle),
        size: Math.random() * 3 + 2,  // Adjusting size for better visibility
        color: `hsl(${Math.random() * 360}, 100%, 80%)`,
        angle,
        radius,
      };
    });
    setStars(newStars);
  };

  const updateGalaxy = () => {
    setStars(prevStars => prevStars.map(star => {
      const newAngle = star.angle + 0.01;
      return {
        ...star,
        x: galaxyCenter.x + star.radius * Math.cos(newAngle),
        y: galaxyCenter.y + star.radius * Math.sin(newAngle),
        angle: newAngle,
      };
    }));
    requestAnimationFrame(updateGalaxy);
  };

  const starStyle = (star) => airCss({
    position: 'absolute',
    borderRadius: '50%',
    width: `${star.size}px`,
    height: `${star.size}px`,
    left: `${star.x}px`,
    top: `${star.y}px`,
    background: star.color,
  });

  const centerStyle = airCss({
    position: 'absolute',
    left: `${galaxyCenter.x}px`,
    top: `${galaxyCenter.y}px`,
    width: '10px',
    height: '10px',
    backgroundColor: '#fff',
    borderRadius: '50%',
    boxShadow: '0 0 20px 5px rgba(255, 255, 255, 0.7)',
  });

  const containerStyle = airCss({
    position: 'relative',
    width: '100vw',
    height: '100vh',
    background: 'radial-gradient(circle, rgba(0, 0, 50, 1) 0%, rgba(0, 0, 0, 1) 100%)',
    overflow: 'hidden',
  });

  this.onMount = () => {
    generateGalaxy();
    updateGalaxy();
  };

  return () => html`
    <div style="${containerStyle}">
      <div style="${centerStyle}"></div>
      ${stars.map(star => html`
        <div key="${star.id}" style="${starStyle(star)}"></div>
      `)}
    </div>
  `;
});
