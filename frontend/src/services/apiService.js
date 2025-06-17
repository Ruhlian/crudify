// apiService.js - Servicio para comunicación con la API

const API_BASE_URL = process.env.REACT_APP_API_URL;

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('token');
  }

  // Configurar headers por defecto
  getHeaders(includeAuth = true) {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (includeAuth && this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Método genérico para hacer peticiones
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(options.includeAuth !== false),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // Métodos HTTP específicos
  async get(endpoint, options = {}) {
    return this.request(endpoint, { method: 'GET', ...options });
  }

  async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options,
    });
  }

  async put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options,
    });
  }

  async patch(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
      ...options,
    });
  }

  async delete(endpoint, options = {}) {
    return this.request(endpoint, { method: 'DELETE', ...options });
  }

  // Métodos de autenticación
  async login(credentials) {
    try {
      const response = await this.post('/auth/login', credentials, { includeAuth: false });
      
      if (response.success && response.data.token) {
        this.token = response.data.token;
        localStorage.setItem('token', this.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  }

  async register(userData) {
    try {
      const response = await this.post('/auth/register', userData, { includeAuth: false });
      
      if (response.success && response.data.token) {
        this.token = response.data.token;
        localStorage.setItem('token', this.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  }

  async logout() {
    try {
      await this.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }

  async verifyToken() {
    try {
      if (!this.token) {
        throw new Error('No token available');
      }
      
      const response = await this.post('/auth/verify-token');
      return response;
    } catch (error) {
      this.logout();
      throw error;
    }
  }

  async getCurrentUser() {
    try {
      const response = await this.get('/auth/me');
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Métodos para usuarios
  async getAllUsers(queryParams = {}) {
    const searchParams = new URLSearchParams(queryParams);
    return this.get(`/users?${searchParams}`);
  }

  async getUserById(id) {
    return this.get(`/users/${id}`);
  }

  async createUser(userData) {
    return this.post('/users', userData);
  }

  async updateUser(id, userData) {
    return this.patch(`/users/${id}`, userData);
  }

  async deactivateUser(id) {
    return this.delete(`/users/${id}`);
  }

  async getUserEquipment(id) {
    return this.get(`/users/${id}/equipment`);
  }

  async getUserStats() {
    return this.get('/users/stats');
  }

  // Métodos para verificar estado de conexión
  async healthCheck() {
    try {
      const response = await this.get('/health', { includeAuth: false });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Método para obtener el usuario guardado en localStorage
  getCurrentUserFromStorage() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // Método para verificar si el usuario está autenticado
  isAuthenticated() {
    return !!this.token && !!localStorage.getItem('user');
  }

  // Método para obtener el rol del usuario actual
  getCurrentUserRole() {
    const user = this.getCurrentUserFromStorage();
    return user ? user.rol : null;
  }

  // Método para verificar permisos
  hasPermission(requiredRole) {
    const currentRole = this.getCurrentUserRole();
    const roleHierarchy = {
      'user': 1,
      'tecnico': 2,
      'admin': 3
    };

    return roleHierarchy[currentRole] >= roleHierarchy[requiredRole];
  }
}

// Crear instancia global del servicio
const apiService = new ApiService();

export default apiService;