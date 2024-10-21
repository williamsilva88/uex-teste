import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import "./ContactList.css";

type Contact = {
  name: string;
  cpf: string;
  phone: string;
  cep: string;
  uf: string;
  cidade: string;
  bairro: string;
  logradouro: string;
  numero: string;
  complemento: string;
  latitude: string;
  longitude: string;
};

type ContactListProps = {
  contacts: Contact[];
  onSelectContact: (contact: Contact) => void;
  onEditContact: (contact: Contact) => void;
  onDeleteContact: (cpf: string) => void;
};

const ContactList: React.FC<ContactListProps> = ({
  contacts,
  onSelectContact,
  onEditContact,
  onDeleteContact,
}) => {
  return (
    <div style={{ paddingTop: "10px" }}>
      {contacts.map((contact, index) => (
        <div
          key={index}
          className="contact-list-item"
          onClick={() => onSelectContact(contact)}
        >
          <span>{contact?.name || "Contato sem Nome"}</span>
          <div className="contact-list-buttons-container">
            <button
              className="contact-list-button"
              onClick={(e) => {
                e.stopPropagation();
                onEditContact(contact);
              }}
              aria-label="Edit"
            >
              <FontAwesomeIcon icon={faEdit} className="contact-list-icon" />
            </button>
            <button
              className="contact-list-button"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteContact(contact.cpf);
              }}
              aria-label="Delete"
            >
              <FontAwesomeIcon icon={faTrash} className="contact-list-icon" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContactList;
