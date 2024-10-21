import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/AuthService";
import "@material/web/textfield/filled-text-field.js";
import "@material/web/button/filled-button.js";

type LoginFormProps = {
  onRegister: () => void;
  onReset: () => void;
};

const LoginForm: React.FC<LoginFormProps> = ({ onRegister, onReset }) => {
  const [error, setError] = useState<string | null>(null);

  // Refs para capturar os valores dos campos de entrada
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const emailField = emailRef.current;
    const passwordField = passwordRef.current;

    const handleEmailInput = (e: any) =>
      (emailRef.current!.value = e.target.value);
    const handlePasswordInput = (e: any) =>
      (passwordRef.current!.value = e.target.value);

    if (emailField) emailField.addEventListener("input", handleEmailInput);
    if (passwordField)
      passwordField.addEventListener("input", handlePasswordInput);

    return () => {
      if (emailField) emailField.removeEventListener("input", handleEmailInput);
      if (passwordField)
        passwordField.removeEventListener("input", handlePasswordInput);
    };
  }, []);

  const handleLogin = () => {
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    if (email && password) {
      const isAuthenticated = AuthService.login(email, password);
      if (isAuthenticated) {
        localStorage.setItem("loggedInUser", email);
        navigate("/home");
      } else {
        setError("Email ou senha incorretos.");
      }
    } else {
      setError("Preencha todos os campos.");
    }
  };

  return (
    <div className="login-form">
      <h2>Login</h2>
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
      <md-filled-button onClick={handleLogin} style={{ margin: "10px 0" }}>
        Entrar
      </md-filled-button>

      {error && <p className="error">{error}</p>}

      <div
        style={{
          marginTop: "10px",
          display: "grid",
          justifyContent: "space-between",
        }}
      >
        <md-outlined-button onClick={onRegister}>
          Cadastrar-se
        </md-outlined-button>
        <md-outlined-button onClick={onReset}>
          Recuperar Senha
        </md-outlined-button>
      </div>
    </div>
  );
};

export default LoginForm;
