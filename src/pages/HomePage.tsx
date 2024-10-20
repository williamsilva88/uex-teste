import React, { useState, useEffect } from "react";
import AuthService from "../services/AuthService";
import ContactService from "../services/ContactService";
import { useNavigate } from "react-router-dom";
import ContactModal from "../components/ContactModal";
import ContactList from "../components/ContactList";
import MapComponent from "../components/MapComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt, faPlus, faCog } from "@fortawesome/free-solid-svg-icons";
import "./HomePage.css";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const user = AuthService.getLoggedUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [contacts, setContacts] = useState<any[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<any[]>([]);
  const [contactToEdit, setContactToEdit] = useState<any | null>(null);
  const [selectedContact, setSelectedContact] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    loadContacts();
  }, []);

  useEffect(() => {
    filterContacts();
  }, [searchTerm, contacts]);

  const loadContacts = () => {
    if (user) {
      const userContacts = ContactService.getContactsForUser(user.email);
      setContacts(userContacts);
      setFilteredContacts(userContacts);
    }
  };

  const filterContacts = () => {
    const lowerCaseTerm = searchTerm.toLowerCase();
    const filtered = contacts.filter(
      (contact) =>
        contact.name.toLowerCase().includes(lowerCaseTerm) ||
        contact.cpf.includes(lowerCaseTerm)
    );
    setFilteredContacts(filtered);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
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
        loadContacts();
        setSelectedContact(null);
      } else {
        console.error(result.message);
      }
    }
  };

  const handleSelectContact = (contact: any) => {
    const latitude = parseFloat(contact.latitude);
    const longitude = parseFloat(contact.longitude);

    if (!isNaN(latitude) && !isNaN(longitude)) {
      setSelectedContact({
        ...contact,
        latitude,
        longitude,
        address: formatAddress(contact),
      });
    } else {
      console.error("Coordenadas inválidas para o contato selecionado");
    }
  };

  const formatAddress = (contact: any): string => {
    const { logradouro, numero, bairro, cidade, uf, cep } = contact;

    let formattedAddress = logradouro ? `${logradouro}` : "";
    formattedAddress += numero ? `, ${numero}` : "";
    formattedAddress += bairro ? ` - ${bairro}` : "";
    formattedAddress += cidade ? `${cidade}` : "";
    formattedAddress += uf ? ` - ${uf}` : "";
    formattedAddress += cep ? `, ${cep}` : "";

    return formattedAddress.trim();
  };

  const handleOpenSettings = () => {
    setIsSettingsOpen(true);
  };

  const handleCloseSettings = () => {
    setIsSettingsOpen(false);
  };

  const handleDeleteAccount = () => {
    const confirmDelete = window.confirm(
      "Tem certeza de que deseja excluir sua conta? Essa ação não pode ser desfeita."
    );
    if (confirmDelete) {
      AuthService.deleteAccount();
      handleLogout();
    }
  };

  return (
    <div className="home-container">
      <div className="sidebar">
        <div className="bar-controls-head">
          <div className="logged-user">
            Bem-vindo, {user?.name || "Usuário"}
          </div>
          <button className="settings-button" onClick={handleOpenSettings}>
            <FontAwesomeIcon icon={faCog} style={{ marginRight: "8px" }} />
            Configurações
          </button>
          {isSettingsOpen && (
            <div className="settings-modal">
              <div className="settings-container">
                <button
                  className="delete-account-button"
                  onClick={handleDeleteAccount}
                >
                  Excluir Conta
                </button>
                <button
                  className="close-settings-button"
                  onClick={handleCloseSettings}
                >
                  Fechar
                </button>
              </div>
            </div>
          )}
          <button className="add-contact-button" onClick={handleOpenModal}>
            <FontAwesomeIcon icon={faPlus} style={{ marginRight: "8px" }} />
            Adicionar Contato
          </button>
        </div>
        <div className="bar-controls-content">
          <div className="contacts-title">Lista de contatos</div>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Pesquisar por nome ou CPF"
            style={{
              width: "calc(100% - 20px)",
              margin: "8px 0",
              padding: "8px",
              fontSize: "16px",
              border: "none",
            }}
          />
          <ContactList
            contacts={filteredContacts}
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
            address={selectedContact.address}
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
