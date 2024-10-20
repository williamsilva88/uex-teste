import React, { useState, useEffect, useRef } from "react";
import "@material/web/textfield/filled-text-field.js";
import "@material/web/button/filled-button.js";
import "@material/web/button/outlined-button.js";
import ContactService from "../services/ContactService";
import AuthService from "../services/AuthService";
import "./ContactModal.css";
import { debounce } from "lodash";

type ContactModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialContact?: any;
};

const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialContact,
}) => {
  const [contact, setContact] = useState<any>({
    name: "",
    cpf: "",
    phone: "",
    cep: "",
    uf: "",
    cidade: "",
    bairro: "",
    logradouro: "",
    numero: "",
    complemento: "",
    latitude: "",
    longitude: "",
  });

  const refs = {
    name: useRef<HTMLInputElement>(null),
    cpf: useRef<HTMLInputElement>(null),
    phone: useRef<HTMLInputElement>(null),
    cep: useRef<HTMLInputElement>(null),
    uf: useRef<HTMLInputElement>(null),
    cidade: useRef<HTMLInputElement>(null),
    bairro: useRef<HTMLInputElement>(null),
    logradouro: useRef<HTMLInputElement>(null),
    numero: useRef<HTMLInputElement>(null),
    complemento: useRef<HTMLInputElement>(null),
    latitude: useRef<HTMLInputElement>(null),
    longitude: useRef<HTMLInputElement>(null),
  };

  useEffect(() => {
    if (initialContact) {
      setContact(initialContact);
    }
  }, [initialContact]);

  const handleChange = (name: string, value: string) => {
    setContact({ ...contact, [name]: value });
  };

  const handleSubmit = () => {
    const user = AuthService.getLoggedUser();
    if (user) {
      const result = ContactService.addContact(user.email, contact);
      if (result.success) {
        onSuccess(); // Notifica o sucesso ao HomePage
        onClose();   // Fecha o modal
      } else {
        alert(result.message);
      }
    } else {
      alert("Usuário não autenticado.");
    }
  };

  if (!isOpen) return null;

  const styleField = {
    width: "100%",
    margin: "8px 0",
  };

  const styleButton = {
    width: "100%",
    margin: "10px 0",
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>{initialContact ? "Atualizar Contato" : "Adicionar Contato"}</h2>
        </div>
        <div className="modal-content">
          <md-filled-text-field
            ref={refs.name}
            label="Nome"
            value={contact.name}
            oninput={(e: any) => handleChange("name", e.target.value)}
            style={styleField}
          ></md-filled-text-field>
          <md-filled-text-field
            ref={refs.cpf}
            label="CPF"
            value={contact.cpf}
            oninput={(e: any) => handleChange("cpf", e.target.value)}
            style={styleField}
          ></md-filled-text-field>
          <md-filled-text-field
            ref={refs.phone}
            label="Telefone"
            value={contact.phone}
            oninput={(e: any) => handleChange("phone", e.target.value)}
            style={styleField}
          ></md-filled-text-field>
          <md-filled-text-field
            ref={refs.cep}
            label="CEP"
            value={contact.cep}
            oninput={(e: any) => handleChange("cep", e.target.value)}
            style={styleField}
          ></md-filled-text-field>
          <md-filled-text-field
            ref={refs.uf}
            label="UF"
            value={contact.uf}
            oninput={(e: any) => handleChange("uf", e.target.value)}
            style={styleField}
          ></md-filled-text-field>
          <md-filled-text-field
            ref={refs.cidade}
            label="Cidade"
            value={contact.cidade}
            oninput={(e: any) => handleChange("cidade", e.target.value)}
            style={styleField}
          ></md-filled-text-field>
          <md-filled-text-field
            ref={refs.logradouro}
            label="Logradouro"
            value={contact.logradouro}
            oninput={(e: any) => handleChange("logradouro", e.target.value)}
            style={styleField}
          ></md-filled-text-field>
          <md-filled-text-field
            ref={refs.numero}
            label="Número"
            value={contact.numero}
            oninput={(e: any) => handleChange("numero", e.target.value)}
            style={styleField}
          ></md-filled-text-field>
          <md-filled-text-field
            ref={refs.complemento}
            label="Complemento"
            value={contact.complemento}
            oninput={(e: any) => handleChange("complemento", e.target.value)}
            style={styleField}
          ></md-filled-text-field>
          <md-filled-text-field
            ref={refs.latitude}
            label="Latitude"
            value={contact.latitude}
            oninput={(e: any) => handleChange("latitude", e.target.value)}
            style={styleField}
          ></md-filled-text-field>
          <md-filled-text-field
            ref={refs.longitude}
            label="Longitude"
            value={contact.longitude}
            oninput={(e: any) => handleChange("longitude", e.target.value)}
            style={styleField}
          ></md-filled-text-field>
          <md-filled-button onClick={handleSubmit} style={styleButton}>
            {initialContact ? "Atualizar" : "Adicionar"}
          </md-filled-button>
          <md-outlined-button onClick={onClose} style={styleButton}>
            Cancelar
          </md-outlined-button>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;