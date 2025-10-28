// frontend/services/websocket-service.js
import { WS_BASE_URL } from '../config.js';

class WebSocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  connect() {
    this.socket = new WebSocket(`${WS_BASE_URL}/ws`);

    this.socket.onopen = () => {
      console.log('WebSocket connected');
      this.notifyListeners('connected', null);
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('WebSocket message:', data);
      this.notifyListeners(data.type, data);
    };

    this.socket.onclose = () => {
      console.log('WebSocket disconnected');
      this.notifyListeners('disconnected', null);
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.notifyListeners('error', error);
    };
  }

  addListener(type, callback) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, []);
    }
    this.listeners.get(type).push(callback);
  }

  removeListener(type, callback) {
    if (this.listeners.has(type)) {
      const callbacks = this.listeners.get(type);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  notifyListeners(type, data) {
    if (this.listeners.has(type)) {
      this.listeners.get(type).forEach(callback => {
        callback(data);
      });
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}

export const webSocketService = new WebSocketService();