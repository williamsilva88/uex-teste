import React, { useState, useEffect, useRef } from "react";
import "@material/web/textfield/filled-text-field.js";
import "@material/web/button/filled-button.js";
import "@material/web/button/outlined-button.js";
import ContactService from "../services/ContactService";
import AuthService from "../services/AuthService";
import ViaCepService from "../services/ViaCepService";
import "./ContactModal.css";

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

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (initialContact && isOpen) {
      Object.keys(refs).forEach((key) => {
        const fieldRef = refs[key as keyof typeof refs].current;
        if (fieldRef) {
          fieldRef.value = initialContact[key] || "";
        }
      });
      setIsEditing(true);
    } else {
      Object.keys(refs).forEach((key) => {
        const fieldRef = refs[key as keyof typeof refs].current;
        if (fieldRef) {
          fieldRef.value = "";
        }
      });
      setIsEditing(false);
    }
  }, [initialContact, isOpen]);

  const handleCepChange = async () => {
    const cepValue = refs.cep.current?.value || "";

    if (cepValue.length === 8) {
      try {
        const cepData = await ViaCepService.consultarCEP(cepValue);
        if (cepData) {
          if (refs.logradouro.current)
            refs.logradouro.current.value = cepData?.logradouro || "";
          if (refs.bairro.current)
            refs.bairro.current.value = cepData?.bairro || "";
          if (refs.cidade.current)
            refs.cidade.current.value = cepData?.localidade || "";
          if (refs.uf.current)
            refs.uf.current.value = cepData?.uf || "";
        }
        console.log("refs:", refs);
      } catch (error) {
        console.error("Erro ao consultar o ViaCEP:", error);
        alert(
          "Não foi possível consultar o CEP. Verifique o valor e tente novamente."
        );
      }
    }
  };

  const handleSubmit = () => {
    const updatedContact = {
      name: refs.name.current?.value || "",
      cpf: refs.cpf.current?.value || "",
      phone: refs.phone.current?.value || "",
      cep: refs.cep.current?.value || "",
      uf: refs.uf.current?.value || "",
      cidade: refs.cidade.current?.value || "",
      bairro: refs.bairro.current?.value || "",
      logradouro: refs.logradouro.current?.value || "",
      numero: refs.numero.current?.value || "",
      complemento: refs.complemento.current?.value || "",
      latitude: refs.latitude.current?.value || "",
      longitude: refs.longitude.current?.value || "",
    };

    const user = AuthService.getLoggedUser();
    if (user) {
      let result;
      if (isEditing) {
        result = ContactService.updateContact(user.email, updatedContact);
      } else {
        result = ContactService.addContact(user.email, updatedContact);
      }

      if (result.success) {
        onSuccess();
        onClose();
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
          <h2>{isEditing ? "Atualizar Contato" : "Adicionar Contato"}</h2>
        </div>
        <div className="modal-content">
          <md-filled-text-field
            ref={refs.name}
            label="Nome"
            style={styleField}
          ></md-filled-text-field>
          <md-filled-text-field
            ref={refs.cpf}
            label="CPF"
            style={styleField}
          ></md-filled-text-field>
          <md-filled-text-field
            ref={refs.phone}
            label="Telefone"
            style={styleField}
          ></md-filled-text-field>
          <md-filled-text-field
            ref={refs.cep}
            label="CEP"
            style={styleField}
            onInput={handleCepChange}
          ></md-filled-text-field>
          <md-filled-text-field
            ref={refs.uf}
            label="UF"
            style={styleField}
          ></md-filled-text-field>
          <md-filled-text-field
            ref={refs.cidade}
            label="Cidade"
            style={styleField}
          ></md-filled-text-field>
          <md-filled-text-field
            ref={refs.bairro}
            label="Bairro"
            style={styleField}
          ></md-filled-text-field>
          <md-filled-text-field
            ref={refs.logradouro}
            label="Logradouro"
            style={styleField}
          ></md-filled-text-field>
          <md-filled-text-field
            ref={refs.numero}
            label="Número"
            style={styleField}
          ></md-filled-text-field>
          <md-filled-text-field
            ref={refs.complemento}
            label="Complemento"
            style={styleField}
          ></md-filled-text-field>
          <md-filled-text-field
            ref={refs.latitude}
            label="Latitude"
            style={styleField}
          ></md-filled-text-field>
          <md-filled-text-field
            ref={refs.longitude}
            label="Longitude"
            style={styleField}
          ></md-filled-text-field>
          <md-filled-button onClick={handleSubmit} style={styleButton}>
            {isEditing ? "Atualizar" : "Adicionar"}
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
