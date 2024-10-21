import React, { useRef, useState, useEffect } from "react";
import AuthService from "../services/AuthService";
import "@material/web/textfield/filled-text-field.js";
import "@material/web/button/filled-button.js";
import "@material/web/button/outlined-button.js";

type RegisterFormProps = {
  onRegisterSuccess: () => void;
  onBackToLogin: () => void;
};

const RegisterForm: React.FC<RegisterFormProps> = ({
  onRegisterSuccess,
  onBackToLogin,
}) => {
  const [error, setError] = useState<string | null>(null);

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const nameField = nameRef.current;
    const emailField = emailRef.current;
    const passwordField = passwordRef.current;
    const confirmPasswordField = confirmPasswordRef.current;

    const handleNameInput = (e: any) =>
      (nameRef.current!.value = e.target.value);
    const handleEmailInput = (e: any) =>
      (emailRef.current!.value = e.target.value);
    const handlePasswordInput = (e: any) =>
      (passwordRef.current!.value = e.target.value);
    const handleConfirmPasswordInput = (e: any) =>
      (confirmPasswordRef.current!.value = e.target.value);

    if (nameField) nameField.addEventListener("input", handleNameInput);
    if (emailField) emailField.addEventListener("input", handleEmailInput);
    if (passwordField)
      passwordField.addEventListener("input", handlePasswordInput);
    if (confirmPasswordField)
      confirmPasswordField.addEventListener(
        "input",
        handleConfirmPasswordInput
      );

    return () => {
      if (nameField) nameField.removeEventListener("input", handleNameInput);
      if (emailField) emailField.removeEventListener("input", handleEmailInput);
      if (passwordField)
        passwordField.removeEventListener("input", handlePasswordInput);
      if (confirmPasswordField)
        confirmPasswordField.removeEventListener(
          "input",
          handleConfirmPasswordInput
        );
    };
  }, []);

  const handleRegister = () => {
    const name = nameRef.current?.value;
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;
    const confirmPassword = confirmPasswordRef.current?.value;

    if (!name || !email || !password || !confirmPassword) {
      setError("Todos os campos são obrigatórios.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não correspondem.");
      return;
    }

    const isRegistered = AuthService.register(name, email, password);
    if (isRegistered) {
      setError(null);
      onRegisterSuccess();
    } else {
      setError("Usuário já registrado com este e-mail.");
    }
  };

  return (
    <div className="register-form">
      <h2>Registrar</h2>
      <md-filled-text-field
        ref={nameRef}
        label="Nome"
        style={{ margin: "10px 0" }}
      ></md-filled-text-field>
      <md-filled-text-field
        ref={emailRef}
        label="Email"
        type="email"
        style={{ margin: "10px 0" }}
      ></md-filled-text-field>
      <md-filled-text-field
        ref={passwordRef}
        label="Senha"
        type="password"
        style={{ margin: "10px 0" }}
      ></md-filled-text-field>
      <md-filled-text-field
        ref={confirmPasswordRef}
        label="Confirme a Senha"
        type="password"
        style={{ margin: "10px 0" }}
      ></md-filled-text-field>
      <md-filled-button
        onClick={handleRegister}
        style={{ width: "100%", margin: "10px 0" }}
      >
        Registrar
      </md-filled-button>

      {error && <p className="error">{error}</p>}

      <md-outlined-button
        onClick={onBackToLogin}
        style={{ width: "100%", margin: "10px 0" }}
      >
        Voltar ao Login
      </md-outlined-button>
    </div>
  );
};

export default RegisterForm;
