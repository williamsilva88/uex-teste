import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/AuthService";

type AuthGuardProps = {
  children: React.ReactNode;
};

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (AuthService.isAuthenticated()) {
      navigate("/home");
    } else {
      navigate("/");
    }
  }, [navigate]);

  return <>{children}</>;
};

export default AuthGuard;
