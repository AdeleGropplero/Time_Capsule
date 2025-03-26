import { Button, Card, Col, Container, Modal, Row } from "react-bootstrap";
import MyNavBar from "./MyNavBar";
import { useEffect, useState } from "react";
import api from "../api/api"; // Importo Axios configurato
import { Form } from "react-bootstrap";

//🛑🛑🛑 Aggiungere la modifica immagine profilo 🛑🛑🛑

function Profilo() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [datiProfilo, setDatiProfilo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modificaProfilo, setModificaProfilo] = useState({
    fullName: "",
    email: ""
  });
  const [immagini, setImmagini] = useState([]);

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

  useEffect(() => {
    api
      .get("/immagini_caps")
      .then((res) => {
        if (res.status === 200) {
          /* console.log(res.data); */
          const immaginiProfilo = res.data.slice(19); //Siccome nella tabella immagini ci sono sia profili che capsule mi prendo le img di interesse ovvero da 20 a 43
          setImmagini(immaginiProfilo);
          /* console.log("immagini profilo", immaginiProfilo); */
        }
      })
      .catch((error) =>
        console.error("Errore nella fetch delle immagini: ", error)
      );
  }, []);

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
        <Row className="justify-content-center">
          <Col xs={12} sm={10} md={8} lg={6}>
            <Card className="my-3 card-profilo">
              <div className="d-flex flex-column align-items-center justify-content-center ms-2 mt-3 mb-3">
                <div className="avatar">
                  <img
                    src="/prova_profilo.jpeg"
                    alt="immagine profilo"
                    className="img-fluid"
                  />
                </div>
                <div className="mt-2 mx-2 name-profilo">
                  <h6 className="name-profilo">{datiProfilo.fullName} </h6>
                </div>
              </div>
              <div className="ms-3">
                <p>
                  {" "}
                  <b>Mail:</b> {datiProfilo.email}
                </p>
                <p>
                  {" "}
                  <b>Time traveler dal:</b> {datiProfilo.dataRegistrazione}
                </p>
              </div>

              <Card.Body className="box-profilo my-3 mx-3">
                <Card.Title>Quanto hai viaggiato?</Card.Title>
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
              <Button
                className="py-0 px-1 bottone-crea modifica-profilo-btn m-2"
                onClick={() => setShowModal(true)}
              >
                <img
                  className="pb-1"
                  src="/iconeGenerali/pencil.svg"
                  alt="modifica"
                />
              </Button>
            </Card>
          </Col>
        </Row>
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
