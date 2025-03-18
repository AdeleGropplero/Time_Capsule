import { Card, Container } from "react-bootstrap";
import MyNavBar from "./MyNavBar";
import { useEffect, useState } from "react";
import api from "../api/api"; // Importo Axios configurato

function Profilo() {
  const user = JSON.parse(localStorage.getItem("user"));
  console.log(user);
  const [datiProfilo, setDatiProfilo] = useState(null);

  useEffect(() => {
    api
      .get(`/profilo/${user.id}`)
      .then((res) => {
        if (res.status === 200) {
          setDatiProfilo(res.data);
          console.log(res.data);
        }
      })
      .catch((err) =>
        console.log("errore nel recupero dati profilo: " + err.response)
      );
  }, [user.id]);

  // 🔹 Se i dati non sono ancora caricati, mostra un messaggio di caricamento
  if (!datiProfilo) {
    return (
      <>
        <MyNavBar />
        <Container>
          <p>Caricamento...</p>
        </Container>
      </>
    );
  }

  return (
    <>
      <MyNavBar />
      <Container>
        <Card className="my-3">
          <div className="d-flex ms-2 mt-3">
            <div className="avatar">
              <img
                src="/prova_profilo.png"
                alt="immagine profilo"
                className="img-fluid"
              />
            </div>
            <div className=" mx-2">
              <h6>{user.fullName}</h6>
              <p>Mail: {datiProfilo.email}</p>
              <p>Time traveller dal: {datiProfilo.dataRegistrazione}</p>
            </div>
          </div>

          <Card.Body>
            <Card.Title>Quanto hai viggiato?</Card.Title>
            <Card.Text>
              Caps personali create: {datiProfilo.numCapsulePersonali}
            </Card.Text>
            <Card.Text>
              Caps di gruppo create: {datiProfilo.numCapsuleGruppo}
            </Card.Text>
            <Card.Text>
              Caps evento create: {datiProfilo.numCapsuleEvento}
            </Card.Text>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}
export default Profilo;
