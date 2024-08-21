import { AirComponent, html, Router, createState, onMount } from '../air-js/core/air.js';

// Enhanced Home component with nested routes
const Home = AirComponent('home-component', function() {
  return () => html`
    <div>
      <h1>Home</h1>
      <route href="/home/welcome">Welcome</route>
      <route href="/home/news">News</route>
    </div>
  `;
});

const Welcome = AirComponent('welcome-component', function() {
  return () => html`<h2>Welcome to our site!
    <route href="/home/welcome/1">Welcome 1</route>
  </h2>`;
});

const Welcome1 = AirComponent('welcome1-component', function() {
    return () => html`<h2>Welcome to our friend huut!</h2>`;
  });

const News = AirComponent('news-component', function() {
  return () => html`<h2>Latest News</h2>`;
});

const About = AirComponent('about-component', function(props) {
  return () => html`
    <div>
      <h1>About</h1>
      <p>id: ${props.RouteParams.id}</p>
      <p>keks: ${props.RouteParams.keks}</p>
    </div>
  `;
});

const Contact = AirComponent('contact-component', function() {
    const [isLoading, setIsLoading] = createState(true);
    const [data, setData] = createState(null);
    const simulateSlowLoad = () => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              message: "Data successfully loaded!",
              timestamp: new Date().toLocaleString()
            });
          }, 3000); // Simulates a 3-second load time
        });
      };
    
    onMount(() => {
        simulateSlowLoad().then((result) => {
            setData(result);
            setIsLoading(false);
        });
    });
  isLoading.onUpdate((isLoading) => {
    console.log('isLoading', isLoading);
  });
  return () => html`
    <div>
    ${isLoading() 
      ? html`
        <div>
          <p>Loading... Please wait.</p>
        </div>
      ` 
      : html`
      <div>
        <h1>Contact</h1>
      </div>
      `
    }
    </div>
`;
});

const Navigation = AirComponent('navigation-component', function() {
  const [isAdmin] = createState(true); // Example of conditional rendering

  return () => html`
    <nav>
      <route href="/home">Home</route>
      <route href="/about/:id/smog/:keks">About</route>
      <route href="/contact">Contact</route>
      ${isAdmin() ? html`<route href="/admin">Admin</route>` : ''}
    </nav>
  `;
});

// Not Found component for 404 errors
const NotFound = AirComponent('not-found-component', function() {
  return () => html`<h1>404 - Page Not Found</h1>`;
});


const Donger = AirComponent('donger-component', function() {
  return () => html`<h1>Donger</h1>`;
});
Router.Routes([
  { 
    path: '/home', 
    aliases:['/homepage'],
    component: 'home-component',
    children: [
      { path: 'welcome', component: 'welcome-component', children: [
        { path: '1', component: 'welcome1-component' },
      ]},
      { path: 'news', component: 'news-component' }
    ]
  },
  { path: '/about/:id/smeg/:keks', aliases:['/grog/:id/bog/:keks'], component: 'about-component' },
  { path: '/contact', component: 'contact-component'},
  { 
    path: '/admin', 
    component: 'admin-component', 
  },
  { path: '*', component: 'not-found-component' },
]);

export const AdvancedRoutingTest = AirComponent('advanced-routing-test-component', function() {
  return () => html`
    <div>
      <navigation-component></navigation-component>
      <router></router>
    </div>
  `;
});