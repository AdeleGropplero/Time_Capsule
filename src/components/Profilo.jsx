import { Button, Card, Container, Modal } from "react-bootstrap";
import MyNavBar from "./MyNavBar";
import { useEffect, useState } from "react";
import api from "../api/api"; // Importo Axios configurato
import { Form } from "react-bootstrap";

//🛑🛑🛑 Aggiungere la modifica immagine profilo 🛑🛑🛑

function Profilo() {
  const user = JSON.parse(localStorage.getItem("user"));
  console.log(user);
  const [datiProfilo, setDatiProfilo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modificaProfilo, setModificaProfilo] = useState({
    fullName: "",
    email: ""
  });
  useEffect(() => {
    api
      .get(`/profilo/${user.id}`)
      .then((res) => {
        if (res.status === 200) {
          setDatiProfilo(res.data);
        }
      })
      .catch((err) =>
        console.log("errore nel recupero dati profilo: " + err.response)
      );
  }, [user.id]);

  useEffect(() => {
    if (datiProfilo) {
      setModificaProfilo({
        fullName: datiProfilo.fullName,
        email: datiProfilo.email
      });
    }
  }, [datiProfilo]);

  if (!datiProfilo) {
    return (
      <>
        <MyNavBar />
        <Container>
          <p>Caricamento...</p> {/* mettere lo spinner */}
        </Container>
      </>
    );
  }

  const handleChange = (e) => {
    setModificaProfilo({ ...modificaProfilo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    api
      .patch(`/profilo/${user.id}`, modificaProfilo)
      .then((res) => {
        if (res.status === 200) {
          setDatiProfilo(res.data);
          setShowModal(false);

          const userAggiornato = { ...user, fullName: res.data.fullName };
          localStorage.setItem("user", JSON.stringify(userAggiornato));
        }
      })
      .catch((error) => {
        console.error("Errore nell'aggiornamento del profilo", error);
      });
  };

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
              <h6>
                {datiProfilo.fullName}{" "}
                <Button
                  className="py-0 px-1 bottone-crea"
                  onClick={() => setShowModal(true)}
                >
                  <img
                    className="pb-1"
                    src="/iconeGenerali/pencil.svg"
                    alt="modifica"
                  />
                </Button>
              </h6>
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

      {/* Modale */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Modifica Profilo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formNome">
              <Form.Label>Nome Completo</Form.Label>
              <Form.Control
                type="text"
                name="fullName"
                value={modificaProfilo.fullName}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formEmail" className="mt-2">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={modificaProfilo.email}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Button type="submit" className="mt-3 bottone-crea">
              Salva Modifiche
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}
export default Profilo;
