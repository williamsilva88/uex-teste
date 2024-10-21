import React, { useState, useRef } from "react";
import AuthService from "../services/AuthService";
import "@material/web/textfield/filled-text-field.js";
import "@material/web/button/filled-button.js";
import "@material/web/button/outlined-button.js";
import "./ResetPasswordForm.css";

type ResetPasswordFormProps = {
  onBackToLogin: () => void;
};

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  onBackToLogin,
}) => {
  const [emailValidated, setEmailValidated] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // Refs para capturar os valores dos campos
  const emailRef = useRef<HTMLInputElement>(null);
  const newPasswordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const validateEmail = () => {
    const email = emailRef.current?.value;
    if (!email) {
      setError("Por favor, informe um e-mail.");
      return;
    }

    const users = AuthService.getUsers();
    const userExists = users.some((user: any) => user.email === email);

    if (userExists) {
      setEmail(email);
      setEmailValidated(true);
      setError(null);
    } else {
      setEmailValidated(false);
      setError("E-mail não encontrado.");
    }
  };

  const handleResetPassword = () => {
    const newPassword = newPasswordRef.current?.value;
    const confirmPassword = confirmPasswordRef.current?.value;

    if (!newPassword || !confirmPassword) {
      setError("Por favor, informe as senhas.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("As senhas não correspondem.");
      return;
    }

    if (email && newPassword) {
      const isReset = AuthService.resetPassword(email, newPassword);
      if (isReset) {
        setError(null);
        onBackToLogin();
      } else {
        setError("Erro ao redefinir a senha.");
      }
    }
  };

  return (
    <div className="reset-password-form">
      <h2>Recuperar Senha</h2>

      {!emailValidated ? (
        <>
          <md-filled-text-field
            ref={emailRef}
            label="Email"
            type="email"
            style={{ margin: "10px 0" }}
          ></md-filled-text-field>
          <md-filled-button
            onClick={validateEmail}
            style={{ margin: "10px 0" }}
          >
            Validar Email
          </md-filled-button>
        </>
      ) : (
        <>
          <md-filled-text-field
            ref={newPasswordRef}
            label="Nova Senha"
            type="password"
            style={{ margin: "10px 0" }}
          ></md-filled-text-field>
          <md-filled-text-field
            ref={confirmPasswordRef}
            label="Confirme a Nova Senha"
            type="password"
            style={{ margin: "10px 0" }}
          ></md-filled-text-field>
          <md-filled-button
            onClick={handleResetPassword}
            style={{ margin: "10px 0" }}
          >
            Redefinir Senha
          </md-filled-button>
        </>
      )}

      <md-outlined-button onClick={onBackToLogin} style={{ margin: "10px 0" }}>
        Voltar ao Login
      </md-outlined-button>

      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default ResetPasswordForm;
