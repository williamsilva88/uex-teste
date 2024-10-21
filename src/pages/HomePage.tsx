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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false); // Modal de exclusão de conta
  const [isDeleteContactDialogOpen, setIsDeleteContactDialogOpen] =
    useState(false); // Modal de exclusão de contato
  const [contactToDelete, setContactToDelete] = useState<any | null>(null); // Contato a ser excluído
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

  // Abre o modal de confirmação de exclusão de contato
  const handleDeleteContact = (cpf: string) => {
    const contact = contacts.find((c) => c.cpf === cpf);
    setContactToDelete(contact);
    setIsDeleteContactDialogOpen(true);
  };

  const handleConfirmDeleteContact = () => {
    if (contactToDelete) {
      const result = ContactService.deleteContact(
        user.email,
        contactToDelete.cpf
      );
      if (result.success) {
        loadContacts();
        setSelectedContact(null);
      } else {
        console.error(result.message);
      }
    }
    setIsDeleteContactDialogOpen(false); // Fecha o modal após a confirmação
  };

  const handleCloseDeleteContactDialog = () => {
    setContactToDelete(null);
    setIsDeleteContactDialogOpen(false); // Fecha o modal sem excluir
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

  const handleOpenDeleteDialog = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
  };

  const handleConfirmDeleteAccount = () => {
    AuthService.deleteAccount();
    handleLogout();
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
                  onClick={handleOpenDeleteDialog}
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
      
          <MapComponent
            latitude={selectedContact?.latitude}
            longitude={selectedContact?.longitude}
            description={selectedContact?.name}
            address={selectedContact?.address}
          />
    
      </div>

      <ContactModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleAddContact}
        initialContact={contactToEdit}
      />

      {/* Modal de confirmação de exclusão de conta */}
      {isDeleteDialogOpen && (
        <md-dialog open>
          <div slot="headline">Excluir Conta</div>
          <form slot="content" id="delete-form" method="dialog">
            Tem certeza de que deseja excluir sua conta? Essa ação não pode ser
            desfeita.
          </form>
          <div slot="actions">
            <md-text-button
              form="delete-form"
              onClick={handleConfirmDeleteAccount}
            >
              Confirmar
            </md-text-button>
            <md-text-button
              form="delete-form"
              onClick={handleCloseDeleteDialog}
            >
              Cancelar
            </md-text-button>
          </div>
        </md-dialog>
      )}

      {/* Modal de confirmação de exclusão de contato */}
      {isDeleteContactDialogOpen && (
        <md-dialog open>
          <div slot="headline">Excluir Contato</div>
          <form slot="content" id="delete-contact-form" method="dialog">
            Tem certeza de que deseja excluir o contato "{contactToDelete?.name}
            "?
          </form>
          <div slot="actions">
            <md-text-button
              form="delete-contact-form"
              onClick={handleConfirmDeleteContact}
            >
              Confirmar
            </md-text-button>
            <md-text-button
              form="delete-contact-form"
              onClick={handleCloseDeleteContactDialog}
            >
              Cancelar
            </md-text-button>
          </div>
        </md-dialog>
      )}
    </div>
  );
};

export default HomePage;
