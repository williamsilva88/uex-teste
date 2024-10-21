const USER_STORAGE_KEY = "sys_users";

class ContactService {
  getUsers() {
    const users = localStorage.getItem(USER_STORAGE_KEY);
    return users ? JSON.parse(users) : [];
  }

  saveUsers(users: any[]) {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(users));
  }

  getContactsForUser(email: string) {
    const users = this.getUsers();
    const user = users.find((u: any) => u.email === email);
    return user ? user.contacts || [] : [];
  }

  addContact(email: string, contact: any) {
    const users = this.getUsers();
    const userIndex = users.findIndex((u: any) => u.email === email);
  
    if (userIndex !== -1) {
      users[userIndex].contacts = users[userIndex].contacts || [];
  
      const existingContact = users[userIndex].contacts.find(
        (c: any) => c.cpf === contact.cpf
      );
  
      if (existingContact) {
        return { success: false, message: "CPF já cadastrado para este usuário" };
      }
  
      users[userIndex].contacts.push(contact);
      this.saveUsers(users);
  
      return { success: true, message: "Contato adicionado com sucesso" };
    }
  
    return { success: false, message: "Usuário não encontrado" };
  }

  updateContact(email: string, contact: any) {
    const users = this.getUsers();
    const userIndex = users.findIndex((u: any) => u.email === email);
    if (userIndex !== -1) {
      const contacts = users[userIndex].contacts || [];
      const contactIndex = contacts.findIndex((c: any) => c.cpf === contact.cpf);
      if (contactIndex !== -1) {
        users[userIndex].contacts[contactIndex] = contact;
        this.saveUsers(users);
        return { success: true, message: "Contato atualizado com sucesso" };
      }
      return { success: false, message: "Contato não encontrado" };
    }
    return { success: false, message: "Usuário não encontrado" };
  }

  deleteContact(email: string, cpf: string) {
    const users = this.getUsers();
    const userIndex = users.findIndex((u: any) => u.email === email);
    if (userIndex !== -1) {
      const contacts = users[userIndex].contacts || [];
      users[userIndex].contacts = contacts.filter((c: any) => c.cpf !== cpf);
      this.saveUsers(users);
      return { success: true, message: "Contato excluído com sucesso" };
    }
    return { success: false, message: "Usuário não encontrado" };
  }
}

export default new ContactService();