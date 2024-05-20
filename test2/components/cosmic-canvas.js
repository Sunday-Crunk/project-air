import { AirComponent, createState, html, airCss } from '../air-js/core/air.js';

export const CosmicCanvas = AirComponent('cosmic-canvas', function() {
  const [particles, setParticles] = createState([]);
  const [mouseDown, setMouseDown] = createState(false);

  const NUM_PARTICLES = 6;
  const MAX_SIZE = 4;
  const MIN_SIZE = 1;
  const MAX_SPEED = 5;
  const GRAVITY = 0.3;
  const PARTICLE_LIFETIME = 20; // Lifetime in frames

  const generateParticles = (x, y) => {
    const newParticles = Array.from({ length: NUM_PARTICLES }, () => ({
      id: Math.random().toString(36).substring(7),
      x,
      y,
      size: Math.random() * (MAX_SIZE - MIN_SIZE) + MIN_SIZE,
      vx: (Math.random() * (MAX_SPEED * 2) - MAX_SPEED),
      vy: (Math.random() * (MAX_SPEED * 2) - MAX_SPEED),
      color: `hsl(${Math.random() * 360}, 100%, 70%)`,
      lifetime: PARTICLE_LIFETIME
    }));
    setParticles(prev => [...prev, ...newParticles]);
  };

  const updateParticles = () => {
    setParticles(prevParticles => prevParticles
      .map(p => ({
        ...p,
        x: p.x + p.vx,
        y: p.y + p.vy,
        vy: p.vy + GRAVITY,
        lifetime: p.lifetime - 1
      }))
      .filter(p => p.lifetime > 0));
  };

  const drawParticles = () => {
    const canvas = document.getElementById('cosmicCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(particle => {
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, 2 * Math.PI, false);
      const gradient = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particle.size);
      gradient.addColorStop(0, particle.color);
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = gradient;
      ctx.globalAlpha = particle.lifetime / PARTICLE_LIFETIME;
      ctx.fill();
      ctx.globalAlpha = 1.0;
    });
  };

  const handleMouseDown = (event) => {
    setMouseDown(true);
    const { clientX: x, clientY: y } = event;
    generateParticles(x, y);
  };

  const handleMouseUp = () => {
    setMouseDown(false);
  };

  const handleMouseMove = (event) => {
    if (mouseDown) {
      const { clientX: x, clientY: y } = event;
      generateParticles(x, y);
    }
  };

  // Animation loop
  setInterval(() => {
    updateParticles();
    drawParticles();
  }, 16);

  return () => html`
    <div 
      style="position: relative; height: 100vh; background: linear-gradient(120deg, #000428, #004e92);" 
      onmousedown="${handleMouseDown}" 
      onmouseup="${handleMouseUp}" 
      onmousemove="${handleMouseMove}"
    >
      <canvas 
        id="cosmicCanvas"
        width="${window.innerWidth}" 
        height="${window.innerHeight}" 
        style="display: block;"
      ></canvas>
    </div>
  `;
});
