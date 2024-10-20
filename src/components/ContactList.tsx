import React from "react";
import { List, ListItem, ListItemText, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

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
}) => {
  return (
    <div>
      {contacts.map((contact, index) => (
        <label>{contact?.name}</label>
      ))}
    </div>
  );
};

export default ContactList;