import React, { useState } from "react";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import ResetPasswordForm from "../components/ResetPasswordForm";
import "@material/web/button/outlined-button.js";

const LoginPage: React.FC = () => {
  const [currentView, setCurrentView] = useState<
    "login" | "register" | "reset"
  >("login");

  return (
    <div className="login-page">
      {currentView === "login" && (
        <LoginForm
          onRegister={() => setCurrentView("register")}
          onReset={() => setCurrentView("reset")}
        />
      )}
      {currentView === "register" && (
        <RegisterForm
          onRegisterSuccess={() => setCurrentView("login")}
          onBackToLogin={() => setCurrentView("login")}
        />
      )}
      {currentView === "reset" && (
        <ResetPasswordForm onBackToLogin={() => setCurrentView("login")} />
      )}
    </div>
  );
};

export default LoginPage;
