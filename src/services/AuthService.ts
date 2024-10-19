import md5 from "md5";

const STORAGE_KEY_USERS = "sys_users";
const STORAGE_KEY_LOGGED_USER = "loggedInUser";

class AuthService {
  getUsers(): any[] {
    const users = localStorage.getItem(STORAGE_KEY_USERS);
    return users ? JSON.parse(users) : [];
  }

  saveUsers(users: any[]): void {
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
  }

  register(name: string, email: string, password: string): boolean {
    const users = this.getUsers();
    if (users.some((user) => user.email === email)) return false;

    users.push({ name, email, password: md5(password) });
    this.saveUsers(users);
    return true;
  }

  login(email: string, password: string): boolean {
    const users = this.getUsers();
    const user = users.find((user) => user.email === email);
    if (!user) return false;

    return user.password === md5(password);
  }

  resetPassword(email: string, newPassword: string): boolean {
    const users = this.getUsers();
    const userIndex = users.findIndex((user) => user.email === email);

    if (userIndex === -1) return false;

    users[userIndex].password = md5(newPassword);
    this.saveUsers(users);
    return true;
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(STORAGE_KEY_LOGGED_USER);
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEY_LOGGED_USER);
  }
}

export default new AuthService();
