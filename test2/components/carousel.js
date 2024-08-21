import { AirComponent, createState, html, airCss } from '../air-js/core/air.js';

export const VerticalCardCarousel = AirComponent('vertical-card-carousel', function() {
  // State for managing the cards and current active card
  const [cards, setCards] = createState([
    { id: 1, title: 'Cosmic Wonders', image: '/api/placeholder/400/300', content: 'Explore the mysteries of deep space.' },
    { id: 2, title: 'Quantum Realms', image: '/api/placeholder/400/300', content: 'Dive into the fabric of reality itself.' },
    { id: 3, title: 'Galactic Civilizations', image: '/api/placeholder/400/300', content: 'Discover advanced alien societies.' },
    { id: 4, title: 'Time Paradoxes', image: '/api/placeholder/400/300', content: 'Unravel the complexities of temporal mechanics.' },
    { id: 5, title: 'Multiversal Nexus', image: '/api/placeholder/400/300', content: 'Explore infinite possibilities across realities.' },
  ]);
  const [activeCardIndex, setActiveCardIndex] = createState(0);

  // Styles
  const styles = {
    container: airCss({
      position: 'relative',
      width: '100%',
      height: '600px',
      maxWidth: '400px',
      margin: '0 auto',
      perspective: '1000px',
      transformStyle: 'preserve-3d',
    }),
    cardStack: airCss({
      position: 'absolute',
      width: '100%',
      height: '100%',
      transformStyle: 'preserve-3d',
      transition: 'transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      transform: `translateY(${activeCardIndex() * -60}px) translateZ(-120px)`,
    }),
    card: airCss({
      position: 'absolute',
      width: '100%',
      height: '400px',
      backgroundColor: '#ffffff',
      borderRadius: '15px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
      padding: '20px',
      transition: 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      overflow: 'hidden',
      cursor: 'pointer',
      backfaceVisibility: 'hidden',
      _hover: {
        transform: 'translateY(-10px) scale(1.02) !important',
        boxShadow: '0 15px 40px rgba(0,0,0,0.3)',
      },
    }),
    cardImage: airCss({
      width: '100%',
      height: '200px',
      objectFit: 'cover',
      borderRadius: '10px',
      marginBottom: '15px',
    }),
    cardTitle: airCss({
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '10px',
      color: '#333',
    }),
    cardContent: airCss({
      fontSize: '16px',
      color: '#666',
      lineHeight: '1.5',
    }),
    navigation: airCss({
      position: 'absolute',
      bottom: '20px',
      left: '0',
      right: '0',
      display: 'flex',
      justifyContent: 'center',
      gap: '10px',
    }),
    navButton: airCss({
      backgroundColor: 'rgba(255,255,255,0.7)',
      border: 'none',
      borderRadius: '50%',
      width: '40px',
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '20px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
      _hover: {
        backgroundColor: 'rgba(255,255,255,0.9)',
      },
    }),
  };

  // Function to handle card click
  const handleCardClick = (index) => {
    if (index === activeCardIndex()) {
      // Implement action for clicking the active card
      console.log('Active card clicked:', cards()[index]);
    } else {
      setActiveCardIndex(index);
    }
  };

  // Function to navigate cards
  const navigateCards = (direction) => {
    console.log("direction: ", direction)
    setActiveCardIndex((prevIndex) => {
      const newIndex = prevIndex + direction;
      if (newIndex < 0) return cards().length - 1;
      if (newIndex >= cards().length) return 0;
      return newIndex;
    });
  };
  const cardStyle = (index) => airCss({
    transform: `translateY(${(index - activeCardIndex()) * 60}px) translateZ(${(index - activeCardIndex()) * -60}px) scale(${1 - Math.abs(index - activeCardIndex()) * 0.1})`,
    opacity: 1 - Math.abs(index - activeCardIndex()) * 0.2,
    zIndex: cards().length - Math.abs(index - activeCardIndex()),
  })
  // Render function
  return () => html`
    <div style="${styles.container()}">
      <div style="${styles.cardStack()}">
      ${cards[activeCardIndex()]}
        ${cards.map((card, index) => {
            return html`

          <div
            style="${styles.card()}${cardStyle(index)}"
            onclick="${() => handleCardClick(index)}"
          >
            <img alt="${card.title}" style="${styles.cardImage()}" />
            <h2 style="${styles.cardTitle()}">${card.title}</h2>
            <p style="${styles.cardContent()}">${card.content}</p>
          </div>
        `})}
      </div>
      <div style="${styles.navigation()}">
        <button style="${styles.navButton()}" onclick="${() => navigateCards(-1)}">↑</button>
        <button style="${styles.navButton()}" onclick="${() => navigateCards(1)}">↓</button>
      </div>
    </div>
  `;
});