import React, { useState, useEffect, useRef } from "react";
import "@material/web/textfield/filled-text-field.js";
import "@material/web/button/filled-button.js";
import "@material/web/button/outlined-button.js";
import ContactService from "../services/ContactService";
import AuthService from "../services/AuthService";
import ViaCepService from "../services/ViaCepService";
import "./ContactModal.css";
import { useToast } from "../contexts/ToastContext";
import { cpf as cpfValidator } from "cpf-cnpj-validator";
import GoogleMapsService from "../services/GoogleMapsService";

type ContactModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialContact?: any;
};

const applyMask = (value: string, mask: string) => {
  let i = 0;
  return mask.replace(/9/g, () => value[i++] || "");
};

const formatMaskedFields = (contact: any) => {
  if (contact.cpf) contact.cpf = applyMask(contact.cpf, "999.999.999-99");
  if (contact.phone) contact.phone = applyMask(contact.phone, "(99) 999999999");
  if (contact.cep) contact.cep = applyMask(contact.cep, "99999-999");
  return contact;
};

const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialContact,
}) => {
  const { addToast } = useToast();

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
  const [cpfError, setCpfError] = useState<string | null>(null);

  useEffect(() => {
    if (initialContact && isOpen) {
      const maskedContact = formatMaskedFields(initialContact);
      Object.keys(refs).forEach((key) => {
        const fieldRef = refs[key as keyof typeof refs].current;
        if (fieldRef) {
          fieldRef.value = maskedContact[key] || "";
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

  const validateCPF = (cpf: string) => {
    const isValid = cpfValidator.isValid(cpf);
    setCpfError(isValid ? null : "CPF inválido");
    return isValid;
  };

  const handleCpfInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    event.target.value = applyMask(value.replace(/\D/g, ""), "999.999.999-99");
    if (!cpfValidator.isValid(value.replace(/\D/g, ""))) {
      setCpfError("CPF inválido");
    } else {
      setCpfError(null);
    }
  };

  const handleCepChange = async () => {
    let cepValue = refs.cep.current?.value || "";
    cepValue = cepValue.replace(/\D/g, "");

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
          if (refs.uf.current) refs.uf.current.value = cepData?.uf || "";
        }
      } catch (error) {
        console.error("Erro ao consultar o ViaCEP:", error);
        addToast(
          "Não foi possível consultar o CEP. Verifique o valor e tente novamente.",
          "error"
        );
      }
    }
  };

  const handleMaskedInput = (
    event: React.ChangeEvent<HTMLInputElement>,
    mask: string
  ) => {
    const { value } = event.target;
    event.target.value = applyMask(value.replace(/\D/g, ""), mask);
  };

  const handleSubmit = () => {
    const updatedContact = {
      name: refs.name.current?.value || "",
      cpf: refs.cpf.current?.value.replace(/\D/g, "") || "",
      phone: refs.phone.current?.value.replace(/\D/g, "") || "",
      cep: refs.cep.current?.value.replace(/\D/g, "") || "",
      uf: refs.uf.current?.value || "",
      cidade: refs.cidade.current?.value || "",
      bairro: refs.bairro.current?.value || "",
      logradouro: refs.logradouro.current?.value || "",
      numero: refs.numero.current?.value || "",
      complemento: refs.complemento.current?.value || "",
      latitude: refs.latitude.current?.value || "",
      longitude: refs.longitude.current?.value || "",
    };

    if (!validateCPF(updatedContact.cpf)) {
      addToast("CPF inválido. Corrija o campo antes de prosseguir.", "error");
      return;
    }

    const user = AuthService.getLoggedUser();
    if (user) {
      let result;
      if (isEditing) {
        result = ContactService.updateContact(user.email, updatedContact);
      } else {
        result = ContactService.addContact(user.email, updatedContact);
      }

      addToast(result.message, result.success ? "success" : "error");

      if (result.success) {
        onSuccess();
        onClose();
      }
    } else {
      addToast("Usuário não autenticado.", "error");
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

  const autocompleteGoogle = async () => {
    const contact = {
      uf: refs.uf.current?.value || "",
      cidade: refs.cidade.current?.value || "",
      bairro: refs.bairro.current?.value || "",
      logradouro: refs.logradouro.current?.value || "",
    };

    const textSearch = [
      contact.uf,
      contact.cidade,
      contact.bairro,
      contact.logradouro,
    ]
      .filter(Boolean)
      .join(" ");

    // const data = await GoogleMapsService.getAutocompleteSuggestions(textSearch);
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

          {isEditing ? (
            <md-filled-text-field
              ref={refs.cpf}
              label="CPF"
              style={styleField}
              value={refs.cpf.current?.value}
              disabled
            ></md-filled-text-field>
          ) : (
            <md-filled-text-field
              ref={refs.cpf}
              label="CPF"
              style={styleField}
              onInput={(e: any) => {handleMaskedInput(e, "999.999.999-99");handleCpfInput}}
              errorMessage={cpfError || ""}
            ></md-filled-text-field>
          )}
           {!isEditing && cpfError && <div className="error-message">{cpfError}</div>}

          <md-filled-text-field
            ref={refs.phone}
            label="Telefone"
            style={styleField}
            onInput={(e: any) => handleMaskedInput(e, "(99) 999999999")}
          ></md-filled-text-field>

          <md-filled-text-field
            ref={refs.cep}
            label="CEP"
            style={styleField}
            onInput={(e: any) => handleMaskedInput(e, "99999-999")}
            onBlur={handleCepChange}
          ></md-filled-text-field>
          <md-filled-text-field
            ref={refs.logradouro}
            label="Logradouro"
            style={styleField}
            onInput={(e: any) => autocompleteGoogle()}
          ></md-filled-text-field>
          <md-filled-text-field
            ref={refs.bairro}
            label="Bairro"
            style={styleField}
          ></md-filled-text-field>
          <md-filled-text-field
            ref={refs.cidade}
            label="Cidade"
            style={styleField}
          ></md-filled-text-field>
          <md-filled-text-field
            ref={refs.uf}
            label="UF"
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
