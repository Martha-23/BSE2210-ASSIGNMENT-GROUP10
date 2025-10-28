// frontend/services/event-service.js
import { API_BASE_URL } from '../config.js';
import { authService } from './auth-service.js';

class EventService {
  async getAllEvents() {
    const response = await fetch(`${API_BASE_URL}/events`, {
      headers: authService.getAuthHeaders(),
    });
    return await response.json();
  }

  async createEvent(eventData) {
    const response = await fetch(`${API_BASE_URL}/events`, {
      method: 'POST',
      headers: authService.getAuthHeaders(),
      body: JSON.stringify(eventData),
    });
    return await response.json();
  }

  async updateEvent(eventId, eventData) {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
      method: 'PUT',
      headers: authService.getAuthHeaders(),
      body: JSON.stringify(eventData),
    });
    return await response.json();
  }

  async deleteEvent(eventId) {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
      method: 'DELETE',
      headers: authService.getAuthHeaders(),
    });
    return await response.json();
  }

  async rsvpToEvent(eventId, status) {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}/rsvp`, {
      method: 'POST',
      headers: authService.getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    return await response.json();
  }
}

export const eventService = new EventService();
