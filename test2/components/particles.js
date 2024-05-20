import { AirComponent, createState, html, airCss } from '../air-js/core/air.js';

export const ParticleExplosion = AirComponent('particle-explosion', function() {
  const [particles, setParticles] = createState([]);

  const NUM_PARTICLES = 50;
  const MAX_SIZE = 15;
  const MIN_SIZE = 5;
  const MAX_SPEED = 3;

  const generateParticles = (x, y) => {
    const newParticles = Array.from({ length: NUM_PARTICLES }, () => ({
      id: Math.random().toString(36).substring(7),
      x,
      y,
      size: Math.random() * (MAX_SIZE - MIN_SIZE) + MIN_SIZE,
      endX: x + (Math.random() * (MAX_SPEED * 2) - MAX_SPEED) * 60,
      endY: y + (Math.random() * (MAX_SPEED * 2) - MAX_SPEED) * 60,
      color: `hsl(${Math.random() * 360}, 100%, 50%)`,
      duration: Math.random() * 1 + 0.5 // Duration between 0.5 and 1.5 seconds
    }));
    setParticles(newParticles);
  };

  const handleClick = (event) => {
    const { clientX: x, clientY: y } = event;
    generateParticles(x, y);
  };

  const particleStyle = (particle) => airCss({
    position: 'absolute',
    borderRadius: '50%',
    width: `${particle.size}px`,
    height: `${particle.size}px`,
    left: `${particle.x}px`,
    top: `${particle.y}px`,
    background: particle.color,
    transition: `transform ${particle.duration}s ease-out, opacity ${particle.duration}s ease-out`,
    transform: `translate(${particle.endX - particle.x}px, ${particle.endY - particle.y}px)`,
    opacity: 1,
  });

  const particleEndStyle = airCss({
    opacity: 0,
  });

  return () => html`
    <div style="position: relative; height: 100vh;" onclick="${handleClick}">
      ${particles.map(particle => html`
        <div key="${particle.id}" style="${particleStyle(particle)}"
          ontransitionend="this.style = '${particleEndStyle}'"></div>
      `)}
    </div>
  `;
});
