import { AirComponent, createState, html, airCss } from '../air-js/core/air.js'

const EcoHavenLandingPage = AirComponent('ecohaven-landing-page', function() {
  // State for the mobile menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = createState(false);

  // State for the active product
  const [activeProduct, setActiveProduct] = createState(0);

  // Products data
  const products = [
    { name: "EcoThermostat", description: "AI-powered temperature control", image: "/api/placeholder/300/200" },
    { name: "SmartSolar", description: "Intelligent solar panel system", image: "/api/placeholder/300/200" },
    { name: "WaterSaver", description: "Advanced water conservation system", image: "/api/placeholder/300/200" },
  ];

  // Testimonials data
  const testimonials = [
    { name: "Sarah L.", text: "EcoHaven has transformed our home into an eco-friendly paradise!", avatar: "/api/placeholder/50/50" },
    { name: "Michael R.", text: "The energy savings are incredible. Best investment we've made!", avatar: "/api/placeholder/50/50" },
    { name: "Emma T.", text: "Their customer service is top-notch. Highly recommended!", avatar: "/api/placeholder/50/50" },
  ];

  // Styles
  const styles = {
    // Base styles
    body: airCss({
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      margin: 0,
      padding: 0,
      backgroundColor: '#f0f8f1',
      color: '#333',
    }),
    container: airCss({
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px',
    }),
    section: airCss({
      padding: '80px 0',
    }),
    button: airCss({
      padding: '12px 24px',
      backgroundColor: '#4CAF50',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
      _hover: {
        backgroundColor: '#45a049',
      },
    }),

    // Header styles
    header: airCss({
      backgroundColor: '#ffffff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      position: 'fixed',
      width: '100%',
      top: 0,
      zIndex: 1000,
    }),
    headerContent: airCss({
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '15px 0',
    }),
    logo: airCss({
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#4CAF50',
    }),
    nav: airCss({
      display: 'flex',
      gap: '20px',
      '@media (max-width: 768px)': {
        display: 'none',
      },
    }),
    navLink: airCss({
      color: '#333',
      textDecoration: 'none',
      _hover: {
        color: '#4CAF50',
      },
    }),
    mobileMenuButton: airCss({
      display: 'none',
      '@media (max-width: 768px)': {
        display: 'block',
      },
    }),
    mobileMenu: airCss({
      display: 'none',
      flexDirection: 'column',
      gap: '10px',
      padding: '20px',
      backgroundColor: '#ffffff',
      '@media (max-width: 768px)': {
        display: () => isMobileMenuOpen() ? 'flex' : 'none',
      },
    }),

    // Hero section styles
    hero: airCss({
      backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("/api/placeholder/1200/600")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      textAlign: 'center',
      color: 'white',
    }),
    heroContent: airCss({
      maxWidth: '800px',
      margin: '0 auto',
    }),
    heroTitle: airCss({
      fontSize: '48px',
      marginBottom: '20px',
    }),
    heroSubtitle: airCss({
      fontSize: '24px',
      marginBottom: '40px',
    }),

    // Features section styles
    featuresGrid: airCss({
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '40px',
    }),
    featureCard: airCss({
      backgroundColor: 'white',
      padding: '30px',
      borderRadius: '10px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      textAlign: 'center',
    }),
    featureIcon: airCss({
      fontSize: '48px',
      color: '#4CAF50',
      marginBottom: '20px',
    }),

    // Product showcase styles
    productShowcase: airCss({
      display: 'flex',
      alignItems: 'center',
      gap: '40px',
      '@media (max-width: 768px)': {
        flexDirection: 'column',
      },
    }),
    productImage: airCss({
      width: '50%',
      borderRadius: '10px',
      '@media (max-width: 768px)': {
        width: '100%',
      },
    }),
    productInfo: airCss({
      width: '50%',
      '@media (max-width: 768px)': {
        width: '100%',
      },
    }),
    productNav: airCss({
      display: 'flex',
      gap: '10px',
      marginBottom: '20px',
    }),
    productNavItem: airCss({
      padding: '10px 20px',
      backgroundColor: '#e0e0e0',
      borderRadius: '5px',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
      _hover: {
        backgroundColor: '#d0d0d0',
      },
    }),
    activeProductNavItem: airCss({
      backgroundColor: '#4CAF50',
      color: 'white',
    }),

    // Testimonials section styles
    testimonialGrid: airCss({
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '40px',
    }),
    testimonialCard: airCss({
      backgroundColor: 'white',
      padding: '30px',
      borderRadius: '10px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    }),
    testimonialHeader: airCss({
      display: 'flex',
      alignItems: 'center',
      marginBottom: '20px',
    }),
    testimonialAvatar: airCss({
      width: '50px',
      height: '50px',
      borderRadius: '50%',
      marginRight: '15px',
    }),

    // Contact form styles
    contactForm: airCss({
      maxWidth: '500px',
      margin: '0 auto',
    }),
    formGroup: airCss({
      marginBottom: '20px',
    }),
    label: airCss({
      display: 'block',
      marginBottom: '5px',
    }),
    input: airCss({
      width: '100%',
      padding: '10px',
      borderRadius: '5px',
      border: '1px solid #ccc',
    }),
    textarea: airCss({
      width: '100%',
      padding: '10px',
      borderRadius: '5px',
      border: '1px solid #ccc',
      minHeight: '100px',
    }),

    // Footer styles
    footer: airCss({
      backgroundColor: '#333',
      color: 'white',
      padding: '40px 0',
      textAlign: 'center',
    }),
  };

  // Component render function
  return () => html`
    <div style="${styles.body}">
      <!-- Header -->
      <header style="${styles.header}">
        <div style="${styles.container}">
          <div style="${styles.headerContent}">
            <div style="${styles.logo}">EcoHaven</div>
            <nav style="${styles.nav}">
              <a href="#features" style="${styles.navLink}">Features</a>
              <a href="#products" style="${styles.navLink}">Products</a>
              <a href="#testimonials" style="${styles.navLink}">Testimonials</a>
              <a href="#contact" style="${styles.navLink}">Contact</a>
            </nav>
            <button style="${styles.mobileMenuButton}" onclick="${() => setIsMobileMenuOpen(!isMobileMenuOpen())}">
              ☰
            </button>
          </div>
          <div style="${styles.mobileMenu}">
            <a href="#features" style="${styles.navLink}">Features</a>
            <a href="#products" style="${styles.navLink}">Products</a>
            <a href="#testimonials" style="${styles.navLink}">Testimonials</a>
            <a href="#contact" style="${styles.navLink}">Contact</a>
          </div>
        </div>
      </header>

      <!-- Hero Section -->
      <section style="${styles.hero}">
        <div style="${styles.heroContent}">
          <h1 style="${styles.heroTitle}">Welcome to EcoHaven</h1>
          <p style="${styles.heroSubtitle}">Transform your home into a sustainable paradise</p>
          <button style="${styles.button}">Get Started</button>
        </div>
      </section>

      <!-- Features Section -->
      <section id="features" style="${styles.section}">
        <div style="${styles.container}">
          <h2>Our Features</h2>
          <div style="${styles.featuresGrid}">
            <div style="${styles.featureCard}">
              <div style="${styles.featureIcon}">🌱</div>
              <h3>Eco-Friendly</h3>
              <p>Reduce your carbon footprint with our sustainable solutions</p>
            </div>
            <div style="${styles.featureCard}">
              <div style="${styles.featureIcon}">💡</div>
              <h3>Smart Technology</h3>
              <p>Cutting-edge AI to optimize your home's efficiency</p>
            </div>
            <div style="${styles.featureCard}">
              <div style="${styles.featureIcon}">💰</div>
              <h3>Cost-Effective</h3>
              <p>Save money while saving the planet</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Product Showcase Section -->
      <section id="products" style="${styles.section}">
        <div style="${styles.container}">
          <h2>Our Products</h2>
          <div style="${styles.productShowcase}">
            <img src="${products[activeProduct()].image}" alt="${products[activeProduct()].name}" style="${styles.productImage}" />
            <div style="${styles.productInfo}">
              <div style="${styles.productNav}">
                ${products.map((product, index) => html`
                  <div 
                    style="${styles.productNavItem} ${index === activeProduct() ? styles.activeProductNavItem : ''}"
                    onclick="${() => setActiveProduct(index)}"
                  >
                    ${product.name}
                  </div>
                `)}
              </div>
              <h3>${products[activeProduct()].name}</h3>
              <p>${products[activeProduct()].description}</p>
              <button style="${styles.button}">Learn More</button>
            </div>
          </div>
        </div>
      </section>

      <!-- Testimonials Section -->
      <section id="testimonials" style="${styles.section}">
        <div style="${styles.container}">
          <h2>What Our Customers Say</h2>
          <div style="${styles.testimonialGrid}">
            ${testimonials.map(testimonial => html`
              <div style="${styles.testimonialCard}">
                <div style="${styles.testimonialHeader}">
                  <img src="${testimonial.avatar}" alt="${testimonial.name}" style="${styles.testimonialAvatar}" />
                  <h3>${testimonial.name}</h3>
                </div>
                <p>${testimonial.text}</p>
              </div>
            `)}
          </div>
        </div>
      </section>

      <!-- Contact Form Section -->
      <section id="contact" style="${styles.section}">
        <div style="${styles.container}">
          <h2>Get in Touch</h2>
          <form style="${styles.contactForm}">
            <div style="${styles.formGroup}">
              <label for="name" style="${styles.label}">Name</label>
              <input type="text" id="name" name="name" required style="${styles.input}" />
            </div>
            <div style="${styles.formGroup}">
              <label for="email" style="${styles.label}">Email</label>
              <input type="email" id="email" name="email" required style="${styles.input}" />
            </div>
            <div style="${styles.formGroup}">
              <label for="message" style="${styles.label}">Message</label>
              <textarea id="message" name="message" required style="${styles.textarea}"></textarea>
            </div>
            <button type="submit" style="${styles.button}">Send Message</button>
          </form>
        </div>
      </section>

      <!-- Footer -->
      <footer style="${styles.footer}">
        <div style="${styles.container}">
          <p>&copy; 2024 EcoHaven. All rights reserved.</p>
        </div>
      </footer>
    </div>
  `;
});

export default EcoHavenLandingPage;