import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Assicurati di avere axios configurato
import { useDispatch } from "react-redux";
import { logout, setUser } from "../redux/reducers/authSlice";

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const checkTokenValidity = () => {
      if (!token || !user) {
        console.warn("Token o user mancante, eseguo logout");
        dispatch(logout());
        navigate("/"); // Reindirizza al login se il token o l'utente mancano
        return;
      }

      // Verifica la validità del token con il backend
      axios
        .get("/token-validation", {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then((res) => {
          if (res.status === 200) {
            setIsAuthenticated(true); // Token valido
            dispatch(setUser(user)); // Imposta l'utente nel Redux
          }
        })
        .catch((error) => {
          console.error("Errore nella validazione del token:", error);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          dispatch(logout()); // Logout in caso di errore nella validazione
          navigate("/"); // Reindirizza al login
        });
    };

    checkTokenValidity();
  }, [dispatch, navigate, token, user]);

  if (!isAuthenticated) {
    return null; // Puoi mostrare un loader mentre verifichi l'autenticazione
  }

  return children; // Se autenticato, renderizza il contenuto protetto
};

export default ProtectedRoute;
