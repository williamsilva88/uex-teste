import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import AuthGuard from "./components/AuthGuard"; // Novo componente de guarda
import "./App.css";

const App: React.FC = () => {
  return (
    <Router>
      <AuthGuard>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
        </Routes>
      </AuthGuard>
    </Router>
  );
};

export default App;