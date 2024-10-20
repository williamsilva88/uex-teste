import React, { useState, useEffect } from "react";
import AuthService from "../services/AuthService";
import ContactService from "../services/ContactService";
import { useNavigate } from "react-router-dom";
import ContactModal from "../components/ContactModal";
import ContactList from "../components/ContactList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt, faPlus } from "@fortawesome/free-solid-svg-icons";
import "./HomePage.css";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const user = AuthService.getLoggedUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contacts, setContacts] = useState<any[]>([]);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = () => {
    if (user) {
      const userContacts = ContactService.getContactsForUser(user.email);
      setContacts(userContacts);
    }
  };

  const handleLogout = () => {
    AuthService.logout();
    navigate("/");
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAddContact = () => {
    loadContacts(); // Recarrega a lista de contatos após adicionar
    handleCloseModal(); // Fecha o modal após sucesso
  };

  const handleEditContact = (contact: any) => {
    // Função para editar um contato (abrir modal de edição)
    console.log("Editar contato:", contact);
  };

  const handleDeleteContact = (cpf: string) => {
    const result = ContactService.deleteContact(user.email, cpf);
    if (result.success) {
      loadContacts(); // Atualiza a lista após exclusão
    } else {
      console.error(result.message);
    }
  };

  const handleSelectContact = (contact: any) => {
    console.log("Contato selecionado:", contact);
  };

  return (
    <div className="home-container">
      {/* Sidebar à esquerda */}
      <div className="sidebar">
        <div className="bar-controls-head">
          <h2>Bem-vindo, {user?.name || "Usuário"}</h2>
          <button className="add-contact-button" onClick={handleOpenModal}>
            <FontAwesomeIcon icon={faPlus} style={{ marginRight: "8px" }} />
            Adicionar Contato
          </button>
        </div>
        <div className="bar-controls-content">
          <div className="contacts-title">Lista de contatos</div>
          <ContactList
            contacts={contacts}
            onSelectContact={handleSelectContact}
            onEditContact={handleEditContact}
            onDeleteContact={handleDeleteContact}
          />
        </div>
        <div className="bar-controls-footer">
          <button className="logout-button" onClick={handleLogout}>
            <FontAwesomeIcon
              icon={faSignOutAlt}
              style={{ marginRight: "8px" }}
            />
            Sair
          </button>
        </div>
      </div>

      {/* Área de conteúdo à direita */}
      <div className="content">
        <h1>Página de Mapa</h1>
        {/* <MapComponent latitude={-25.427} longitude={-49.273} /> */}
      </div>

      {/* Modal de Adicionar Contato */}
      <ContactModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleAddContact}
      />
    </div>
  );
};

export default HomePage;
