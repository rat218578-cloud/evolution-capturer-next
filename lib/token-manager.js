// Gerencia o token JWT (igual ao diogocartas)
export class TokenManager {
  static getToken() {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(/token=([^;]+)/);
    return match ? match[1] : null;
  }
  
  static setToken(token) {
    document.cookie = `token=${token}; path=/; max-age=2592000`;
  }
  
  static clearToken() {
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }
  
  static decodeToken(token) {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return null;
    }
  }
}
