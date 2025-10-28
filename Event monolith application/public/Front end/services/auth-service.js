// frontend/services/auth-service.js
import { API_BASE_URL } from '../config.js';

class AuthService {
  constructor() {
    this.token = localStorage.getItem('authToken');
  }

  async login(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (response.ok) {
        this.token = data.token;
        localStorage.setItem('authToken', this.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        return data;
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      throw error;
    }
  }

  async register(email, password, role = 'ATTENDEE') {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await response.json();
      
      if (response.ok) {
        this.token = data.token;
        localStorage.setItem('authToken', this.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        return data;
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      throw error;
    }
  }

  logout() {
    this.token = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  getAuthHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    };
  }

  isAuthenticated() {
    return !!this.token;
  }

  getUser() {
    return JSON.parse(localStorage.getItem('user'));
  }
}

export const authService = new AuthService();
