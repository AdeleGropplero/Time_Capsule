import { Container } from "react-bootstrap";
import MyNavBar from "./MyNavBar";

function LeMieCaps() {
  const fullName = JSON.parse(localStorage.getItem("user")).fullName;
  return (
    <>
      <MyNavBar />
      <Container>
        <h4 className="text-center mt-3">
          Benvenuto {fullName}, ecco le tue caps!
        </h4>
        <p className="mt-3">Capsule Personali</p>
        //fetch capsule personali
        <p className="mt-3">Capsule Gruppo</p>
        //fetch capsule gruppo
        <p className="mt-3">Capsule Evento</p>
        //fetch capsule Evento
      </Container>
    </>
  );
}
export default LeMieCaps;
