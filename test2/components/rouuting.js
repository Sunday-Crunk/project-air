// index.js

import { AirComponent, html, Router} from '../air-js/core/air.js';

const Home = AirComponent('home-component', function() {
  return () => html`
    <div style="position: relative;">
      <h1>Home</h1>
    </div>
    `
  ;
});

const Welcome = AirComponent('welcome-component', function() {
    return () => html`
      <div style="position: relative;">
        <h1>Welcome</h1>
      </div>
      `
    ;
  });

const News = AirComponent('news-component', function() {
    return () => html`
      <div style="position: relative;">
        <h1>News</h1>
      </div>
      `
    ;
  });

const About = AirComponent('about-component', function(props) {
  return () => html`
    <div style="position: relative;">
      <h1>About</h1>
      <p>id: ${props.RouteParams.id}</p>
      <p>keks: ${props.RouteParams.keks}</p>
    </div>
    `
  ;
});

const Contact = AirComponent('contact-component', function() {
  return () => html`
    <div style="position: relative;">
      <h1>Contact</h1>
    </div>
    `
  ;
});

const Navigation = AirComponent('navigation-component', function() {
  return () => html`
    <nav>
      <route href="/home">Home</route>
      <route href="/about/:id/smeg/:keks">About</route>
      <route href="/contact">Contact</route>
    </nav>
  `;
});
const Transition = AirComponent('air-transition', function() {
  return () => html`
    <div class="transition-container">
      <h1>Transition</h1>
    </div>
  `;
});
Router.Routes([
  { path: '/home', component: 'home-component', children: [
    { path: '/welcome', component: 'welcome-component' },
    { path: '/news', component: 'news-component' },
  ]},
  { path: '/about/:id/smeg/:keks', component: 'about-component' },
  { path: '/contact', component: 'contact-component' },
  { path: '*', component: 'home-component' },
]);

export const RoutingTest = AirComponent('routing-test-component', function() {
  return () => html`
    <div>
      <navigation-component></navigation-component>
      <router></router>
    </div>
  `;
});