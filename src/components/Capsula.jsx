import { useEffect, useState } from "react";
import api from "../api/api"; // Importa Axios configurato
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  Col,
  Container,
  Row,
  Button,
  Form,
  Spinner,
  Modal
} from "react-bootstrap";
import MyNavBar from "./MyNavBar";
import { Carousel } from "react-bootstrap";

function Capsula() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [capsula, setCapsula] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false); // Stato per abilitare la modifica
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    newMedia: [], // Contiene SOLO i nuovi file caricati dall'utente
    newTextFiles: [],
    pubblica: false,
    addMail: []
  });

  const [isLoading, setIsLoading] = useState(false); // Stato per gestire il caricamento
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  /*  */

  /*   const [showAdd, setShowAdd] = useState(false);
  const handleCloseAdd = () => setShowAdd(false);
  const handleShowAdd = () => setShowAdd(true); */ //implementazione futura

  const [emailInput, setEmailInput] = useState("");

  // VERIFICA PER LA VISUALIZZAZIONE, SE LA CAP è PUBBLICA E UN UTENTE ESTERNO LA VEDE
  // NON DEVE AVERE LA POSSIBILITà DI MODIFICARLA O CANCELLARLA.
  const [isOwner, setIsOwner] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    api
      .get(`/capsula/${id}`)
      .then((res) => {
        if (res.status === 200) {
          /*  console.log(res.data); */
          setCapsula(res.data);

          setFormData((prev) => ({
            ...prev,
            title: res.data.title,
            message: res.data.message,
            pubblica: res.data.pubblica
          }));
        }
      })
      .catch((error) =>
        console.error("Errore nel recupero della capsula: ", error)
      )
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (capsula && currentUser) {
      // Aggiungo controllo su capsula
      const isOwner = capsula.utentiIds.includes(currentUser.id);
      setIsOwner(isOwner);
    }
  }, [capsula, currentUser]);

  if (loading) {
    return (
      <div className="text-center mt-3">
        <Spinner
          animation="border"
          size="sm"
          role="status"
          aria-hidden="true"
        />
        Caricamento...
      </div>
    );
  }

  if (!capsula) {
    return <p className="text-center mt-3">Capsula non trovata.</p>;
  }

  const handleDelete = () => {
    if (window.confirm("Sei sicuro di voler eliminare questa capsula?")) {
      api
        .delete(`/capsula/${id}`)
        .then((res) => {
          console.log(res);
          if (res.status === 200) {
            alert("Capsula eliminata con successo!");
            navigate(`/le-mie-caps/:id`); // Reindirizza l'utente alla lista delle capsule
          }
        })
        .catch((error) => {
          console.error("Errore durante l'eliminazione della capsula:", error);
        });
    }
  };

  // Controllo se la capsula è apribile
  const oggi = new Date().toISOString().split("T")[0]; // Ottiene la data odierna in formato YYYY-MM-DD /* .toISOString() converte la data in una stringa nel formato ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ),  .split("T")[0] divide la stringa al carattere "T" (che separa la data dall'orario) e prende solo la prima parte, ossia YYYY-MM-DD*/
  const capsulaAperta = capsula.openDate <= oggi;

  // Funzione per gestire il caricamento dei file
  const handleFileUpload = (e) => {
    const selectedFiles = Array.from(e.target.files).map((file) => ({
      id: crypto.randomUUID(), // Genera un ID univoco per ogni file. ATTENZIONE non ha nulla a che vedere con il db. è solo un id temporaneo.
      name: file.name, // Nome originale del file
      type: file.type, // Tipo MIME del file (es. "image/png", "video/mp4")
      file // Mantiene il file originale
    })); /* è una collezione di file selezionati dall'utente tramite il campo di input. Si tratta di un oggetto di tipo FileList, che è simile a un array, ma non ha tutte le caratteristiche di un array JavaScript standard (per esempio, non ha metodi come forEach). */
    setFormData((prev) => ({
      ...prev,
      newMedia: [
        ...prev.newMedia,
        ...selectedFiles.filter(
          (f) => f.type.startsWith("image/") || f.type.startsWith("video/")
        )
      ],
      newTextFiles: [
        ...prev.newTextFiles,
        ...selectedFiles.filter(
          (f) =>
            f.type === "application/pdf" ||
            f.name.endsWith(".docx") ||
            f.name.endsWith(".doc") ||
            f.name.endsWith(".txt")
        )
      ]
    }));
  };

  // Funzione per salvare le modifiche della capsula
  const handleSaveChanges = (e) => {
    e.preventDefault();

    setIsLoading(true);

    const updateForm = new FormData();
    updateForm.append("title", formData.title);
    updateForm.append("message", formData.message);
    updateForm.append("pubblica", formData.pubblica);

    // Aggiungo solo i nuovi file poichè la logica gi gestione dei file precedentemente caricati, l'ho gestita nel back.
    formData.newMedia.forEach((file) => updateForm.append("media", file.file));
    formData.newTextFiles.forEach((file) =>
      updateForm.append("textFiles", file.file)
    );
    formData.addMail.forEach((email) => updateForm.append("addMail", email));

    api
      .put(`/capsula/${id}/update`, updateForm)
      .then((res) => {
        if (res.status === 200) {
          alert("Capsula aggiornata con successo!");
          setEditMode(false);

          // Svuoto solo i nuovi file dopo l'invio
          setFormData((prev) => ({
            ...prev,
            newMedia: [],
            newTextFiles: [],
            addMail: []
          }));

          // Ricarico la capsula per mostrare i nuovi file salvati
          api.get(`/capsula/${id}`).then((res) => {
            if (res.status === 200) {
              setCapsula(res.data);
            }
          });
        }
      })
      .catch((error) => {
        console.error("Errore durante l'aggiornamento della capsula:", error);
      })
      .finally(() => {
        setIsLoading(false); // Termina il caricamento
      });
  };

  const removeFile = (fileId, type) => {
    setFormData((prev) => {
      if (type === "image") {
        return {
          ...prev,
          newMedia: prev.newMedia.filter((file) => file.id !== fileId) // Rimuove il file con l'ID specificato
        };
      } else if (type === "text") {
        return {
          ...prev,
          newTextFiles: prev.newTextFiles.filter((file) => file.id !== fileId) // Rimuove il file con l'ID specificato
        };
      }
      return prev; // Se il tipo non è valido, restituisci lo stato precedente
    });
  };

  /* AGGIUNGI EMAIL */
  const handleSwitchChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      pubblica: e.target.checked // ✅ Aggiorna lo stato in base a `checked`
    }));
  };

  // Funzione per gestire i cambiamenti nei campi di input
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "addMail") {
      setEmailInput(value); // Aggiorna il valore della mail
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const addEmail = () => {
    // Controllo se l'email è valida
    if (!emailInput.trim() || !emailInput.includes("@")) {
      alert("Inserisci un'email valida.");
      return;
    }

    if (formData.addMail.includes(emailInput)) {
      alert("Questa mail è già stata aggiunta.");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      addMail: [...prev.addMail, emailInput]
    }));

    setEmailInput("");
  };

  const removeInvito = (email) => {
    setFormData((prev) => ({
      ...prev,
      addMail: prev.addMail.filter((e) => e !== email) // Rimuovi solo l'email specifica
    }));
  };

  return (
    <>
      <MyNavBar />
      <Container className="mt-4 ">
        <Card className="shadow-sm p-2 mb-5 card-capsula">
          <div className="d-flex justify-content-between">
            {/* Bottone per tornare indietro*/}
            <Button
              className="bottone-crea upped"
              onClick={() => navigate(`/le-mie-caps/:id`)}
            >
              <img src="/iconeGenerali/arrowL.svg" alt="torna indietro" />
            </Button>
            {isOwner && (
              <>
                {/* Bottone mostra partecipanti*/}
                {capsula.invitati.length > 1 && (
                  <Button className="bottone-crea upped" onClick={handleShow}>
                    <img
                      className="white"
                      src="/iconeGenerali/gruppo.svg"
                      alt="torna indietro"
                    />
                  </Button>
                )}

                {/* Bottone per eliminare la capsula */}
                <Button className="bottone-crea upped" onClick={handleDelete}>
                  <img src="/iconeGenerali/trash.svg" alt="cestino" />
                </Button>
              </>
            )}
          </div>
          <Card.Body className="titolo-su-cap">
            <Card.Title className="text-center">{capsula.title}</Card.Title>
            {capsulaAperta ? (
              <Card.Text className="text-center  mb-1">
                <strong>Aperta il:</strong> {capsula.openDate}
              </Card.Text>
            ) : (
              <Card.Text className="text-center">
                <strong>Si apre il:</strong> {capsula.openDate}
              </Card.Text>
            )}

            {capsula.pubblica ? (
              <Card.Text className="text-center  mb-1">
                <small>
                  {" "}
                  Pubblica <i class="bi bi-unlock  mb-1"></i>
                </small>
              </Card.Text>
            ) : (
              <Card.Text className="text-center">
                <small>
                  {" "}
                  Privata <i class="bi bi-lock"></i>
                </small>
              </Card.Text>
            )}

            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                Partecipanti{" "}
                {/*  <Button className="ms-3 bottone-crea" onClick={handleShowAdd}>
                  <img src="/iconeGenerali/add.svg" alt="aggiungi" />
                </Button> */}
              </Modal.Header>
              <Modal.Body>
                <ul>
                  {capsula.invitati.map((mail, index) => (
                    <li key={index}>
                      <span>{mail}</span>
                    </li>
                  ))}
                </ul>
              </Modal.Body>
            </Modal>

            {capsulaAperta ? (
              //----------------------------------------------------------------
              // Se la capsula è apribile, mostra i contenuti
              //----------------------------------------------------------------
              <>
                <Card.Text className="text-center">
                  <strong>Messaggio:</strong>
                </Card.Text>
                <Card.Text className="messaggio">
                  {capsula.message || "Nessun messaggio presente."}
                </Card.Text>
                {capsula.media && capsula.media.length > 0 && (
                  <>
                    <div className=" mt-4 mb-5 text-center">
                      <h5 className="">Media</h5>
                    </div>

                    <Carousel className="mb-4 caroselloCapsula">
                      {capsula.media.map((file, index) => (
                        <Carousel.Item key={index}>
                          {file.url.match(/\.(mp4|webm|mov)$/) ? (
                            <div className="ratio ratio-16x9">
                              <video controls className="w-100">
                                <source
                                  src={file.url}
                                  type={`video/${file.url.split(".").pop()}`}
                                />
                                Il tuo browser non supporta il video.
                              </video>
                            </div>
                          ) : (
                            <div className="d-flex justify-content-center">
                              <img
                                src={file.url}
                                alt={`Media ${index + 1}`}
                                className="img-fluid rounded shadow"
                              />
                            </div>
                          )}
                        </Carousel.Item>
                      ))}
                    </Carousel>
                  </>
                )}

                {/* FILE DI TESTO */}
                {capsula.textFiles && capsula.textFiles.length > 0 ? (
                  <>
                    <h5 className="mt-4 ms-5">File di Testo</h5>
                    <ul className="ms-5">
                      {capsula.textFiles.map((file, index) => {
                        const fileName = file.url.split("/").pop(); // Ottiene il nome completo del file
                        return (
                          <li key={index}>
                            <div className="ms-2 mb-2">
                              <a
                                href={file.url}
                                download={fileName} // Specifica il nome del file da scaricare
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {fileName}
                              </a>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </>
                ) : null}
              </>
            ) : (
              //----------------------------------------------------------------
              // Se la capsula non è ancora apribile, permetti la modifica
              //----------------------------------------------------------------
              <>
                <p className="text-center text-danger mb-1">
                  🔒 La capsula non può ancora essere aperta.{" "}
                </p>
                {isOwner && (
                  <>
                    <p className="text-center text-success">
                      {" "}
                      Se vuoi aggiungi ricordi!.
                    </p>

                    <div className="d-flex justify-content-center mt-4">
                      <Button
                        className="bottone-crea"
                        onClick={() => setEditMode(!editMode)}
                      >
                        {editMode ? "Annulla Modifica" : "Modifica Capsula"}
                      </Button>
                    </div>
                  </>
                )}
                {editMode && (
                  <>
                    <Form className="mt-4" onSubmit={handleSaveChanges}>
                      {capsula.invitati.length > 1 ? (
                        <Container>
                          <Form.Group className="mb-3 form-text">
                            <Form.Label>
                              Inserisci le mail di chi vuoi invitare
                            </Form.Label>
                            <div className="d-flex align-items-center">
                              {/* Campo di input email */}
                              <Form.Control
                                type="email"
                                name="addMail"
                                value={emailInput}
                                onChange={handleChange}
                                placeholder="Inserisci un'email"
                              />
                              <Button
                                size="sm"
                                className="bottone-crea "
                                onClick={() => addEmail()}
                              >
                                <span>Aggiungi</span>
                              </Button>
                            </div>

                            {/* Messaggio di errore per email non valida */}
                            <Form.Control.Feedback type="invalid">
                              Inserisci un'email valida.
                            </Form.Control.Feedback>
                          </Form.Group>
                          {/* Lista inviti */}
                          {formData.addMail.length > 0 && (
                            <ul>
                              {formData.addMail.map((mail, index) => (
                                <li key={index}>
                                  <Button
                                    size="sm"
                                    className="me-2 mb-1 cancel-btn bottone-crea"
                                    onClick={() => removeInvito(mail)}
                                  >
                                    X
                                  </Button>
                                  <span>{mail}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </Container>
                      ) : null}

                      {/* Modifica Titolo */}
                      <Form.Group className="mb-3">
                        <Form.Label>Titolo</Form.Label>
                        <Form.Control
                          type="text"
                          defaultValue={capsula.title}
                          onChange={(e) =>
                            setFormData({ ...formData, title: e.target.value })
                          }
                        />
                      </Form.Group>

                      {/* Modifica Messaggio */}
                      <Form.Group className="mb-3">
                        <Form.Label>Messaggio</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={8}
                          defaultValue={capsula.message}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              message: e.target.value
                            })
                          }
                        />
                      </Form.Group>

                      {/* Upload di immagini/video e file di testo*/}
                      <Form.Group className="mb-3 form-text">
                        <Form.Label>Carica foto/video/file di testo</Form.Label>
                        <Form.Control
                          type="file"
                          multiple /* Permette di selezionare più file. */
                          accept="image/*,video/*,.pdf,.doc,.docx,.txt" // Accetta immagini, video e file di testo
                          onChange={handleFileUpload}
                          id="fileInput" //questo mi serve per recuperare l'elemento con il getElementbyId
                        />
                        {/* Bottone personalizzato */}
                        <Button
                          className="bottone-file"
                          onClick={() =>
                            document.getElementById("fileInput").click()
                          } //è un modo per "simulare" un click sull'input type="file" nascosto, quando l'utente preme il bottone.
                        >
                          📁 Seleziona File
                        </Button>
                      </Form.Group>

                      <Form.Check // prettier-ignore
                        type="switch"
                        name="pubblica"
                        id="custom-switch"
                        label="Pubblica"
                        checked={formData.pubblica} // Associa il valore allo stato
                        onChange={handleSwitchChange} // Gestisce il cambio di stato
                      />
                      <div className="d-flex justify-content-center mt-4">
                        <Button
                          className="bottone-crea"
                          type="submit"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                              className="me-2"
                            />
                          ) : null}
                          Salva Modifiche
                        </Button>
                      </div>
                    </Form>
                    {formData.newMedia.length > 0 ||
                    formData.newTextFiles.length > 0 ? (
                      <div className="form-capsula-div mb-3 mt-3">
                        {/* Mostra i file caricati */}
                        <h6>I tuoi caricamenti</h6>
                        {formData.newMedia.length > 0 && (
                          <ul className="mt-1">
                            {formData.newMedia.map((file, index) => (
                              <li
                                key={index}
                                className="d-flex align-items-center"
                              >
                                <Button
                                  size="sm"
                                  className="me-2 cancel-btn bottone-crea"
                                  onClick={() => removeFile(file.id, "image")}
                                >
                                  X
                                </Button>
                                {/* Visualizza l'immagine */}
                                <img
                                  src={URL.createObjectURL(file.file)} // Usa file.file per ottenere l'URL dell'immagine
                                  alt={file.name}
                                  style={{
                                    width: 40,
                                    height: 40,
                                    objectFit: "cover"
                                  }}
                                  className="me-2"
                                />
                              </li>
                            ))}
                          </ul>
                        )}
                        {formData.newTextFiles.length > 0 && (
                          <ul className="">
                            {formData.newTextFiles.map((file, index) => (
                              <li key={index}>
                                <Button
                                  size="sm"
                                  className="me-2 mb-1 cancel-btn bottone-crea"
                                  onClick={() => removeFile(file.id, "text")}
                                >
                                  X
                                </Button>
                                <span>{file.name}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ) : null}
                  </>
                )}
              </>
            )}
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}

export default Capsula;

/*  { MEDIA: Immagini e Video }
                {capsula.media && capsula.media.length > 0 ? (
                  <>
                    <h5 className="mt-4">Media</h5>
                    <Row className="g-3">
                      {capsula.media.map((file, index) => (
                        <Col key={index} xs={6} sm={4} md={3}>
                          {typeof file.url === "string" &&
                          file.url.match(/\.(mp4|webm)$/) ? (
                            <video controls width="100%">
                              <source src={file.url} type="video/mp4" />
                              Il tuo browser non supporta il video.
                            </video>
                          ) : (
                            typeof file.url === "string" && (
                              <img
                                src={file.url}
                                alt="Media capsula"
                                className="img-fluid rounded shadow"
                              />
                            )
                          )}
                        </Col>
                      ))}
                    </Row>
                  </>
                ) : null}{" "}*/
