import md5 from "md5";

const USER_STORAGE_KEY = "sys_users";
const LOGGED_USER_KEY = "loggedInUser";
const TOKEN_KEY = "auth_token";

class AuthService {
  getUsers() {
    const users = localStorage.getItem(USER_STORAGE_KEY);
    return users ? JSON.parse(users) : [];
  }

  saveUsers(users: any[]) {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(users));
  }

  login(email: string, password: string): boolean {
    const users = this.getUsers();
    const encryptedPassword = md5(password);
    const user = users.find(
      (u: any) => u.email === email && u.password === encryptedPassword
    );
    if (user) {
      const token = md5(email + Date.now());
      const expiresAt = Date.now() + 1500 * 60 * 1000; // 15 minutos
      localStorage.setItem(TOKEN_KEY, JSON.stringify({ token, expiresAt }));
      localStorage.setItem(LOGGED_USER_KEY, email);
      return true;
    }
    return false;
  }

  getLoggedUser() {
    const email = localStorage.getItem(LOGGED_USER_KEY);
    if (email) {
      const users = this.getUsers();
      return users.find((u: any) => u.email === email) || null;
    }
    return null;
  }

  isAuthenticated(): boolean {
    const tokenData = localStorage.getItem(TOKEN_KEY);
    if (!tokenData) return false;

    const { expiresAt } = JSON.parse(tokenData);
    return Date.now() < expiresAt;
  }

  logout(): void {
    localStorage.removeItem(LOGGED_USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
  }

  resetPassword(email: string, newPassword: string): boolean {
    const users = this.getUsers();
    const userIndex = users.findIndex((u: any) => u.email === email);
    if (userIndex !== -1) {
      users[userIndex].password = md5(newPassword);
      this.saveUsers(users);
      return true;
    }
    return false;
  }

  register(name: string, email: string, password: string): boolean {
    const users = this.getUsers();
    if (users.some((u: any) => u.email === email)) {
      return false;
    }

    const newUser = {
      name,
      email,
      password: md5(password),
      contacts: [],
    };
    users.push(newUser);
    this.saveUsers(users);
    return true;
  }
}

export default new AuthService();
