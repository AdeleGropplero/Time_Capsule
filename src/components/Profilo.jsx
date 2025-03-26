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
    email: "",
    avatar: null
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
        email: datiProfilo.email,
        avatar: datiProfilo.avatar
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

    const formData =
      new FormData(); /* Utilizzo FormData per inviare il file insieme ai dati del profilo (nome, email) quando l'utente invia il modulo. Questo oggetto è particolarmente utile quando si inviano dati misti (ad esempio testo e file) a un server.*/
    formData.append("fullName", modificaProfilo.fullName);
    formData.append("email", modificaProfilo.email);

    if (modificaProfilo.avatar) {
      formData.append("avatar", modificaProfilo.avatar); // Aggiungi l'immagine come file
    }

    api
      .patch(`/profilo/${user.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })
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

  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      const fileData = {
        id: crypto.randomUUID(), // Genera un ID univoco per il file
        name: selectedFile.name, // Nome originale del file
        type: selectedFile.type, // Tipo MIME del file (es. "image/png", "image/jpeg")
        file: selectedFile // Mantiene il file originale
      };

      // Crea un URL temporaneo per l'immagine (utile per la visualizzazione)
      const imageUrl = URL.createObjectURL(selectedFile);

      // Imposta il file come avatar e l'URL temporaneo per la visualizzazione
      setModificaProfilo((prev) => ({
        ...prev,
        avatar: fileData.file, // Salva il file
        avatarUrl: imageUrl // Salva l'URL temporaneo per la visualizzazione
      }));
    }
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
                    src={
                      modificaProfilo.avatar
                        ? modificaProfilo.avatar
                        : immagini[Math.floor(Math.random() * immagini.length)]
                            .url
                    }
                    alt="immagine profilo"
                    className="img-fluid"
                    style={{
                      objectFit: "cover", // O 'contain' a seconda del comportamento desiderato
                      width: "100%",
                      height: "100%"
                    }}
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

            <Form.Group className="mb-3 mt-2 form-text">
              <Form.Label className="modifica-profilo-img">
                Cambia immagine profilo
              </Form.Label>
              <Form.Control
                type="file"
                accept="image/*" // Accetta immagini
                onChange={handleFileUpload}
                id="fileInput" //questo mi serve per recuperare l'elemento con il getElementbyId
              />
              {/* Anteprima dell'immagine, se disponibile */}
              {modificaProfilo.avatarUrl && (
                <div className="mt-2">
                  <img
                    src={modificaProfilo.avatarUrl}
                    alt="Anteprima"
                    className="img-fluid mb-3"
                    style={{ maxWidth: "200px" }} // Imposta una dimensione massima per l'anteprima
                  />
                </div>
              )}

              {/* Bottone personalizzato */}
              <Button
                className="bottone-file"
                onClick={() => document.getElementById("fileInput").click()} //è un modo per "simulare" un click sull'input type="file" nascosto, quando l'utente preme il bottone.
              >
                📁 Seleziona File
              </Button>
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
