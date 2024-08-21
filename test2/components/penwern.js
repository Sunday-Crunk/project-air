import { AirComponent, html, airCss, createState } from '../air-js/core/air.js';

export const ArchiveX = AirComponent('archive-x', function() {
  const [searchQuery, setSearchQuery] = createState('');

  const globalStyles = airCss({

  });

  const containerStyle = airCss({
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem'
  });

  const headerStyle = airCss({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem'
  });

  const logoStyle = airCss({
    fontSize: '2rem',
    fontWeight: '700',
    color: 'var(--primary-color)',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    transform: 'skew(-5deg)',
    transition: 'all 0.3s ease',
    _hover: {
      textShadow: '0 0 10px var(--primary-color)'
    }
  });

  const navStyle = airCss({
    display: 'flex',
    gap: '1rem'
  });

  const navItemStyle = airCss({
    textDecoration: 'none',
    color: 'var(--on-surface-color)',
    fontWeight: '500',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    background: 'var(--surface-color)',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s ease',
    _hover: {
      background: 'var(--primary-color)',
      color: '#fff',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 20px rgba(98, 0, 238, 0.4)'
    }
  });

  const heroStyle = airCss({
    textAlign: 'center',
    marginBottom: '3rem'
  });

  const heroTitleStyle = airCss({
    fontSize: '3rem',
    marginBottom: '1rem',
    color: 'var(--primary-color)'
  });

  const heroParagraphStyle = airCss({
    fontSize: '1.2rem',
    maxWidth: '800px',
    margin: '0 auto'
  });

  const searchContainerStyle = airCss({
    position: 'relative',
    marginBottom: '2rem'
  });

  const searchInputStyle = airCss({
    width: '100%',
    padding: '1rem 1.5rem',
    fontSize: '1.2rem',
    border: 'none',
    borderRadius: '30px',
    background: 'var(--surface-color)',
    color: 'var(--on-surface-color)',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s ease',
    _focus: {
      outline: 'none',
      boxShadow: '0 0 0 2px var(--primary-color)'
    }
  });

  const searchIconStyle = airCss({
    position: 'absolute',
    right: '1.5rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--on-surface-color)',
    fontSize: '1.5rem'
  });

  const gridStyle = airCss({
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem',
    marginBottom: '3rem'
  });

  const cardStyle = airCss({
    position: 'relative',
    background: 'var(--surface-color)',
    borderRadius: '20px',
    padding: '1.5rem',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
    transformStyle: 'preserve-3d',
    _before: {
      content: "''",
      position: 'absolute',
      top: '-50%',
      left: '-50%',
      width: '200%',
      height: '200%',
      background: 'radial-gradient(circle, var(--primary-color) 0%, transparent 50%)',
      opacity: '0.1',
      transform: 'rotate(30deg)',
      pointerEvents: 'none'
    },
    _hover: {
      transform: 'perspective(1000px) rotateX(10deg) rotateY(10deg)',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
    },
    _after: {
      content: "''",
      position: 'absolute',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 100%)',
      pointerEvents: 'none'
    }
  });

  const cardTitleStyle = airCss({
    fontSize: '1.5rem',
    marginBottom: '1rem',
    color: 'var(--secondary-color)'
  });

  const cardContentStyle = airCss({
    fontSize: '1rem',
    lineHeight: '1.5'
  });

  const featuresStyle = airCss({
    display: 'flex',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    gap: '2rem',
    marginBottom: '3rem'
  });

  const featureStyle = airCss({
    flexBasis: 'calc(33% - 2rem)',
    textAlign: 'center',
    padding: '2rem',
    background: 'var(--surface-color)',
    borderRadius: '20px',
    transition: 'all 0.3s ease',
    _hover: {
      transform: 'translateY(-10px)',
      boxShadow: '0 10px 30px rgba(98, 0, 238, 0.2)'
    }
  });

  const featureIconStyle = airCss({
    fontSize: '3rem',
    marginBottom: '1rem',
    color: 'var(--primary-color)'
  });

  const featureTitleStyle = airCss({
    marginBottom: '1rem',
    color: 'var(--secondary-color)'
  });

  const ctaStyle = airCss({
    textAlign: 'center',
    marginBottom: '3rem'
  });

  const ctaButtonStyle = airCss({
    display: 'inline-block',
    padding: '1rem 2rem',
    fontSize: '1.2rem',
    textDecoration: 'none',
    color: '#fff',
    backgroundColor: 'var(--primary-color)',
    borderRadius: '30px',
    transition: 'all 0.3s ease',
    _hover: {
      backgroundColor: 'var(--secondary-color)',
      boxShadow: '0 0 20px rgba(3, 218, 198, 0.5)'
    }
  });

  const floatingElementStyle = airCss({
    position: 'absolute',
    width: '100px',
    height: '100px',
    background: 'var(--primary-color)',
    borderRadius: '50%',
    opacity: '0.1',
    animation: 'float 6s ease-in-out infinite',
    
  });

  const footerStyle = airCss({
    textAlign: 'center',
    padding: '2rem 0',
    background: 'var(--surface-color)',
    backdropFilter: 'blur(10px)'
  });

  const footerParagraphStyle = airCss({
    marginBottom: '1rem'
  });

  const socialLinksStyle = airCss({
    '& a': {
      color: 'var(--primary-color)',
      fontSize: '1.5rem',
      margin: '0 0.5rem',
      transition: 'all 0.3s ease',
      _hover: {
        color: 'var(--secondary-color)',
        transform: 'translateY(-3px)'
      }
    }
  });

  const handleSearchInput = (e) => {
    setSearchQuery(e.target.value);
  };

  return () => html`
    <style>
    :root {
      @import: url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap');
      --primary-color: #6200ee;
      --secondary-color: #03dac6;
      --background-color: #121212;
      --surface-color: rgba(255, 255, 255, 0.05);
      --on-surface-color: rgba(255, 255, 255, 0.87);
 }
    body {
      font-family: Roboto, sans-serif;
      background-color: var(--background-color);
      color: var(--on-surface-color);
      overflow-x: hidden
    }
    @keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
}
    </style>
    <div style="${containerStyle()}">
      <header style="${headerStyle()}">
        <div style="${logoStyle()}">ArchiveX</div>
        <nav style="${navStyle()}">
          <a href="#" style="${navItemStyle()}">Home</a>
          <a href="#" style="${navItemStyle()}">Collections</a>
          <a href="#" style="${navItemStyle()}">About</a>
          <a href="#" style="${navItemStyle()}">Contact</a>
        </nav>
      </header>

      <section style="${heroStyle()}">
        <h1 style="${heroTitleStyle()}">Unlock the Past, Preserve the Future</h1>
        <p style="${heroParagraphStyle()}">Dive into a world of knowledge with ArchiveX, your gateway to centuries of human wisdom and creativity.</p>
      </section>

      <div style="${searchContainerStyle()}">
        <input type="text" style="${searchInputStyle()}" placeholder="Search through millennia of knowledge..." value="${searchQuery()}" oninput="${handleSearchInput}">
        <span style="${searchIconStyle()}">🔍</span>
      </div>

      <div style="${gridStyle()}">
        <div style="${cardStyle()}">
          <h2 style="${cardTitleStyle()}">Historical Documents</h2>
          <p style="${cardContentStyle()}">Explore a vast collection of historical documents from various eras and civilizations. From ancient scrolls to modern manuscripts, uncover the stories that shaped our world.</p>
        </div>
        <div style="${cardStyle()}">
          <h2 style="${cardTitleStyle()}">Rare Manuscripts</h2>
          <p style="${cardContentStyle()}">Discover unique and valuable manuscripts preserved through the ages. Get unprecedented access to fragile texts and illuminated manuscripts from diverse cultures.</p>
        </div>
        <div style="${cardStyle()}">
          <h2 style="${cardTitleStyle()}">Digital Archives</h2>
          <p style="${cardContentStyle()}">Access our extensive digital archives, featuring millions of scanned documents. Navigate through history with our state-of-the-art digitization and indexing technologies.</p>
        </div>
        <div style="${cardStyle()}">
          <h2 style="${cardTitleStyle()}">Multimedia Collections</h2>
          <p style="${cardContentStyle()}">Browse through our curated collections of images, audio, and video materials. From historical photographs to recorded speeches, immerse yourself in the sights and sounds of the past.</p>
        </div>
      </div>

      <section style="${featuresStyle()}">
        <div style="${featureStyle()}">
          <div style="${featureIconStyle()}">🔍</div>
          <h3 style="${featureTitleStyle()}">Advanced Search</h3>
          <p>Utilize our powerful search algorithms to find exactly what you're looking for across millions of records.</p>
        </div>
        <div style="${featureStyle()}">
          <div style="${featureIconStyle()}">🔐</div>
          <h3 style="${featureTitleStyle()}">Secure Access</h3>
          <p>Rest easy knowing your research is protected with state-of-the-art security measures and encryption.</p>
        </div>
        <div style="${featureStyle()}">
          <div style="${featureIconStyle()}">🌐</div>
          <h3 style="${featureTitleStyle()}">Global Network</h3>
          <p>Connect with archives and institutions worldwide, expanding your research possibilities.</p>
        </div>
      </section>

      <section style="${ctaStyle()}">
        <a href="#" style="${ctaButtonStyle()}">Start Exploring Now</a>
      </section>
    </div>

    <footer style="${footerStyle()}">
      <p style="${footerParagraphStyle()}">&copy; 2024 ArchiveX. All rights reserved.</p>
      <div style="${socialLinksStyle()}">
        <a href="#" aria-label="Facebook">📘</a>
        <a href="#" aria-label="Twitter">🐦</a>
        <a href="#" aria-label="Instagram">📷</a>
        <a href="#" aria-label="LinkedIn">💼</a>
      </div>
    </footer>

    <div style="${floatingElementStyle()}${airCss({ top: '10%', left: '10%', animationDelay: '0s' })()}"></div>
    <div style="${floatingElementStyle()}${airCss({ top: '70%', right: '20%', animationDelay: '2s' })()}"></div>
    <div style="${floatingElementStyle()}${airCss({ bottom: '15%', left: '30%', animationDelay: '4s' })()}"></div>
  `;
});
