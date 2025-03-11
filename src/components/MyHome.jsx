import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import CaroselloEventi from "./componentsHome/CaroselloEventi";
import ChooseCapsule from "./componentsHome/chooseCapsule";
import ChooseTypeEvent from "./componentsHome/ChooseTypeEvent";
import MySearchBar from "./componentsHome/mySearchBar";
import MyNavBar from "./MyNavBar";
import { useSelector } from "react-redux";

function MyHome() {
  const navigate = useNavigate(); // Aggiungi il navigate hook
  const token = useSelector((state) => state.auth.token); // Recupero il token da Redux con Selector
  useEffect(() => {
    if (!token) {
      navigate("/"); // Se il token manca, manda l'utente al login
    }
  }, [token, navigate]); // Dipendenze corrette

  return (
    <>
      <MyNavBar />
      <MySearchBar />
      <CaroselloEventi />
      <ChooseCapsule />
      <ChooseTypeEvent />
    </>
  );
}

export default MyHome;
