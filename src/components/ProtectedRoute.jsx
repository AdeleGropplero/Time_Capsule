import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Controlla se il token esiste nel localStorage
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (token) {
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem(token);
      localStorage.removeItem(user);
      navigate("/"); // Se non autenticato, reindirizza alla pagina di login
    }
  }, [navigate]);

  if (!isAuthenticated) {
    return null; // Puoi restituire null o un altro componente di caricamento finché non sei sicuro dello stato di autenticazione
  }

  return children; // Se l'utente è autenticato, mostra la pagina richiesta
};

export default ProtectedRoute;
