import React, { useState, useEffect } from "react";
import AuthService from "../services/AuthService";
import ContactService from "../services/ContactService";
import { useNavigate } from "react-router-dom";
import ContactModal from "../components/ContactModal";
import ContactList from "../components/ContactList";
import MapComponent from "../components/MapComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt, faPlus } from "@fortawesome/free-solid-svg-icons";
import "./HomePage.css";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const user = AuthService.getLoggedUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contacts, setContacts] = useState<any[]>([]);
  const [contactToEdit, setContactToEdit] = useState<any | null>(null);
  const [selectedContact, setSelectedContact] = useState<any | null>(null);

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
    setContactToEdit(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAddContact = () => {
    loadContacts();
    handleCloseModal();
  };

  const handleEditContact = (contact: any) => {
    setContactToEdit(contact);
    setIsModalOpen(true);
  };

  const handleDeleteContact = (cpf: string) => {
    const confirmDelete = window.confirm(
      "Tem certeza de que deseja excluir este contato?"
    );
    if (confirmDelete) {
      const result = ContactService.deleteContact(user.email, cpf);
      if (result.success) {
        loadContacts(); // Atualiza a lista de contatos
        setSelectedContact(null); // Limpa o contato selecionado no mapa
      } else {
        console.error(result.message);
      }
    }
  };

  const handleSelectContact = (contact: any) => {
    const latitude = parseFloat(contact.latitude);
    const longitude = parseFloat(contact.longitude);

    if (!isNaN(latitude) && !isNaN(longitude)) {
      setSelectedContact({ ...contact, latitude, longitude });
    } else {
      console.error("Coordenadas inválidas para o contato selecionado");
    }
  };

  return (
    <div className="home-container">
      <div className="sidebar">
        <div className="bar-controls-head">
          <div className="logged-user">
            Bem-vindo, {user?.name || "Usuário"}
          </div>
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

      <div className="content">
        {selectedContact && (
          <MapComponent
            latitude={selectedContact.latitude}
            longitude={selectedContact.longitude}
            description={selectedContact.name}
          />
        )}
      </div>

      <ContactModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleAddContact}
        initialContact={contactToEdit}
      />
    </div>
  );
};

export default HomePage;
