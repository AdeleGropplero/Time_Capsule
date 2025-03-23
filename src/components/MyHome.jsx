import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import CaroselloEventi from "./componentsHome/CaroselloEventi";
import ChooseCapsule from "./componentsHome/chooseCapsule";
import ChooseTypeEvent from "./componentsHome/ChooseTypeEvent";
import MySearchBar from "./componentsHome/mySearchBar";
import MyNavBar from "./MyNavBar";

function MyHome() {
  const navigate = useNavigate(); // Aggiungi il navigate hook
  const token = localStorage.getItem("token");
  useEffect(() => {
    if (!token) {
      navigate("/"); // Se il token manca, manda l'utente al login
    }
  }, [token, navigate]); // Dipendenze corrette

  return (
    <>
      <MyNavBar />
      <Container fluid className="justify-content-center container-home">
        <MySearchBar />
        <ChooseCapsule />
        <ChooseTypeEvent />
        <CaroselloEventi />
      </Container>
    </>
  );
}

export default MyHome;
