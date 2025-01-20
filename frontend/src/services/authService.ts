import api from './api';

const TOKEN_KEY = 'token';

export const authService = {
  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  },

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  removeToken() {
    localStorage.removeItem(TOKEN_KEY);
    delete api.defaults.headers.common['Authorization'];
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem(TOKEN_KEY);
  },

  getUserNameFromToken(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const [, payload] = token.split('.');
      const decodedPayload = JSON.parse(atob(payload));
      return decodedPayload.name || "annonymous";
    } catch (error) {
      console.error('Failed to parse token:', error);
      return null;
    }
  },
};
