import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import CaroselloEventi from "./componentsHome/CaroselloEventi";
import ChooseCapsule from "./componentsHome/chooseCapsule";
import MySearchBar from "./componentsHome/mySearchBar";
import MyNavBar from "./MyNavBar";
import ComingSoon from "./componentsHome/ComingSoon";

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
      <Container fluid className="justify-content-center container-home mt-4">
        <MySearchBar />
        <ChooseCapsule />
      </Container>
      <ComingSoon />
    </>
  );
}

export default MyHome;
