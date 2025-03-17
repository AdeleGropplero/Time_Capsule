import { useEffect, useState } from "react";
import api from "../../api/api"; // Importa Axios configurato
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  Col,
  Container,
  Row,
  Button,
  Form,
  Spinner
} from "react-bootstrap";
import MyNavBar from "../MyNavBar";

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
    newTextFiles: []
  });

  useEffect(() => {
    api
      .get(`/capsula/${id}`)
      .then((res) => {
        if (res.status === 200) {
          setCapsula(res.data);

          setFormData((prev) => ({
            ...prev,
            title: res.data.title,
            message: res.data.message
          }));
        }
      })
      .catch((error) =>
        console.error("Errore nel recupero della capsula:", error)
      )
      .finally(() => setLoading(false));
  }, [id]);

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
          if (res.status === 200) {
            alert("Capsula eliminata con successo!");
            navigate("/le-mie-capsule"); // Reindirizza l'utente alla lista delle capsule
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
  const handleFileUpload = (e, fileType) => {
    const selectedFiles = Array.from(
      e.target.files
    ); /* è una collezione di file selezionati dall'utente tramite il campo di input. Si tratta di un oggetto di tipo FileList, che è simile a un array, ma non ha tutte le caratteristiche di un array JavaScript standard (per esempio, non ha metodi come forEach). */
    setFormData((prev) => ({
      ...prev,
      [`new${fileType}`]: [
        ...prev[`new${fileType}`],
        ...selectedFiles
      ] /* Qui stai usando la **notazione di accesso dinamico** alle proprietà di un oggetto. La stringa new${fileType}diventa il nome della proprietà che contiene i file appena caricati. Ad esempio, sefileTypeè"media", la proprietà sarà newMedia`. */
    }));
  };

  // Funzione per salvare le modifiche della capsula
  const handleSaveChanges = (e) => {
    e.preventDefault();

    const updateForm = new FormData();
    updateForm.append("title", formData.title);
    updateForm.append("message", formData.message);

    // Aggiungo solo i nuovi file poichè la logica gi gestione dei file precedentemente caricati, l'ho gestita nel back.
    formData.newMedia.forEach((file) => updateForm.append("media", file));
    formData.newTextFiles.forEach((file) =>
      updateForm.append("textFiles", file)
    );

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
            newTextFiles: []
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
      });
  };

  return (
    <>
      <MyNavBar />
      <Container className="mt-4">
        <Card className="shadow-sm p-4">
          <Card.Body>
            <Card.Title className="text-center">{capsula.title}</Card.Title>
            <Card.Text className="text-center">
              <strong>Data di apertura:</strong> {capsula.openDate}
            </Card.Text>

            {capsulaAperta ? (
              //----------------------------------------------------------------
              // Se la capsula è apribile, mostra i contenuti
              //----------------------------------------------------------------
              <>
                <Card.Text className="text-center">
                  <strong>Messaggio:</strong>{" "}
                  {capsula.message || "Nessun messaggio presente."}
                </Card.Text>
                {/* MEDIA: Immagini e Video */}
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
                ) : null}
                {/* FILE DI TESTO */}
                {capsula.textFiles && capsula.textFiles.length > 0 ? (
                  <>
                    <h5 className="mt-4">File di Testo</h5>
                    <ul>
                      {capsula.textFiles.map((file, index) => (
                        <li key={index}>
                          <a
                            href={file.url}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Scarica {file.url.split("/").pop()}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : null}
              </>
            ) : (
              //----------------------------------------------------------------
              // Se la capsula non è ancora apribile, permetti la modifica
              //----------------------------------------------------------------
              <>
                <p className="text-center text-warning">
                  🔒 La capsula non può ancora essere aperta. Puoi modificarla.
                </p>

                <Button
                  variant="primary"
                  onClick={() => setEditMode(!editMode)}
                >
                  {editMode ? "Annulla Modifica" : "Modifica Capsula"}
                </Button>

                {editMode && (
                  <Form className="mt-4" onSubmit={handleSaveChanges}>
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
                        rows={3}
                        defaultValue={capsula.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                      />
                    </Form.Group>

                    {/* Upload Media */}
                    <Form.Group className="mb-3">
                      <Form.Label>Aggiungi Foto/Video</Form.Label>
                      <Form.Control
                        type="file"
                        multiple
                        accept="image/*,video/*"
                        onChange={(e) => handleFileUpload(e, "Media")}
                      />
                    </Form.Group>

                    {/* Upload File di Testo */}
                    <Form.Group className="mb-3">
                      <Form.Label>Aggiungi File di Testo</Form.Label>
                      <Form.Control
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx,.txt"
                        onChange={(e) => handleFileUpload(e, "TextFiles")}
                      />
                    </Form.Group>

                    <Button variant="success" type="submit ">
                      Salva Modifiche
                    </Button>
                  </Form>
                )}
              </>
            )}

            {/* Bottone per eliminare la capsula */}
            <Button variant="danger" className="mt-4" onClick={handleDelete}>
              Elimina Capsula
            </Button>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}

export default Capsula;
