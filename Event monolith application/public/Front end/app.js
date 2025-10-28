// frontend/app.js
import { authService } from './services/auth-service.js';
import { eventService } from './services/event-service.js';
import { webSocketService } from './services/websocket-service.js';

class EventApp {
  constructor() {
    this.init();
  }

  init() {
    // Check if user is already logged in
    if (authService.isAuthenticated()) {
      this.showApp();
      this.loadEvents();
      this.setupWebSocket();
    } else {
      this.showAuth();
    }

    // Setup WebSocket listeners for real-time updates
    this.setupWebSocketListeners();
  }

  showAuth() {
    document.getElementById('auth-section').classList.remove('hidden');
    document.getElementById('app-section').classList.add('hidden');
  }

  showApp() {
    document.getElementById('auth-section').classList.add('hidden');
    document.getElementById('app-section').classList.remove('hidden');
    
    const user = authService.getUser();
    document.getElementById('user-info').textContent = `Welcome, ${user.email} (${user.role})`;

    // Show create event form for organizers and admins
    if (user.role === 'ORGANIZER' || user.role === 'ADMIN') {
      document.getElementById('create-event-form').classList.remove('hidden');
    }
  }

  async loadEvents() {
    try {
      const events = await eventService.getAllEvents();
      this.displayEvents(events);
    } catch (error) {
      alert('Error loading events: ' + error.message);
    }
  }

  displayEvents(events) {
    const eventsList = document.getElementById('events-list');
    eventsList.innerHTML = '';

    events.forEach(event => {
      const eventCard = document.createElement('div');
      eventCard.className = 'event-card';
      eventCard.innerHTML = `
        <h3>${event.title}</h3>
        <p>${event.description}</p>
        <p><strong>Date:</strong> ${new Date(event.date).toLocaleString()}</p>
        <p><strong>Location:</strong> ${event.location}</p>
        <p><strong>Organizer:</strong> ${event.organizer.email}</p>
        <p><strong>Approved:</strong> ${event.approved ? 'Yes' : 'No'}</p>
        <div>
          <button onclick="app.rsvpToEvent('${event.id}', 'GOING')">Going</button>
          <button onclick="app.rsvpToEvent('${event.id}', 'MAYBE')">Maybe</button>
          <button onclick="app.rsvpToEvent('${event.id}', 'NOT_GOING')">Not Going</button>
        </div>
      `;
      eventsList.appendChild(eventCard);
    });
  }

  setupWebSocket() {
    webSocketService.connect();
  }

  setupWebSocketListeners() {
    webSocketService.addListener('event.created', (data) => {
      this.addUpdate(`New event created: ${data.event.title}`);
      this.loadEvents(); // Refresh events list
    });

    webSocketService.addListener('event.updated', (data) => {
      this.addUpdate(`Event updated: ${data.event.title}`);
      this.loadEvents();
    });

    webSocketService.addListener('rsvp.created', (data) => {
      this.addUpdate(`New RSVP: ${data.user.email} is ${data.rsvp.status} for ${data.event.title}`);
    });
  }

  addUpdate(message) {
    const updatesList = document.getElementById('updates-list');
    const update = document.createElement('div');
    update.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    updatesList.prepend(update);
  }

  async login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
      await authService.login(email, password);
      this.showApp();
      this.loadEvents();
      this.setupWebSocket();
    } catch (error) {
      alert('Login failed: ' + error.message);
    }
  }

  async register() {
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const role = document.getElementById('register-role').value;

    try {
      await authService.register(email, password, role);
      this.showApp();
      this.loadEvents();
      this.setupWebSocket();
    } catch (error) {
      alert('Registration failed: ' + error.message);
    }
  }

  logout() {
    authService.logout();
    webSocketService.disconnect();
    this.showAuth();
  }

  async createEvent() {
    const title = document.getElementById('event-title').value;
    const description = document.getElementById('event-description').value;
    const date = document.getElementById('event-date').value;
    const location = document.getElementById('event-location').value;

    try {
      await eventService.createEvent({ title, description, date, location });
      alert('Event created successfully!');
      // Clear form
      document.getElementById('event-title').value = '';
      document.getElementById('event-description').value = '';
      document.getElementById('event-date').value = '';
      document.getElementById('event-location').value = '';
      // Reload events
      this.loadEvents();
    } catch (error) {
      alert('Error creating event: ' + error.message);
    }
  }

  async rsvpToEvent(eventId, status) {
    try {
      await eventService.rsvpToEvent(eventId, status);
      alert(`RSVP status set to: ${status}`);
    } catch (error) {
      alert('Error updating RSVP: ' + error.message);
    }
  }
}

// Global functions for HTML onclick handlers
window.login = () => app.login();
window.register = () => app.register();
window.logout = () => app.logout();
window.showRegister = () => {
  document.getElementById('login-form').classList.add('hidden');
  document.getElementById('register-form').classList.remove('hidden');
};
window.showLogin = () => {
  document.getElementById('register-form').classList.add('hidden');
  document.getElementById('login-form').classList.remove('hidden');
};
window.createEvent = () => app.createEvent();

// Initialize app
const app = new EventApp();
export default app;