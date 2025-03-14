import { useEffect, useState } from "react";
import api from "../../api/api"; // Importa Axios configurato
import { useParams } from "react-router-dom";
import { Card, Col, Container, Row } from "react-bootstrap";
import { Spinner } from "react-bootstrap";
import MyNavBar from "../MyNavBar";

function Capsula() {
  const { id } = useParams();
  const [capsula, setCapsula] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/capsula/${id}`)
      .then((res) => {
        if (res.status === 200) {
          setCapsula(res.data);
        }
      })
      .catch((error) =>
        console.error("Errore nel recupero della capsula:", error)
      )
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <p className="text-center mt-3">
        {" "}
        <Spinner
          as="span"
          animation="border"
          size="sm"
          role="status"
          aria-hidden="true"
        />
        Caricamento...
      </p>
    );
  }

  if (!capsula) {
    return <p className="text-center mt-3">Capsula non trovata.</p>;
  }

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
            <Card.Text className="text-center">
              <strong>Messaggio:</strong>{" "}
              {capsula.message || "Nessun messaggio presente."}
            </Card.Text>

            {/* MEDIA: Immagini e Video */}
            <h5 className="mt-4">Media</h5>
            {capsula.media && capsula.media.length > 0 ? (
              <Row className="g-3">
                {capsula.media.map((file, index) => (
                  <Col key={index} xs={6} sm={4} md={3}>
                    {/* Verifica se 'file.url' è una stringa */}
                    {typeof file.url === "string" &&
                    (file.url.endsWith(".mp4") ||
                      file.url.endsWith(".webm")) ? (
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
            ) : (
              <p>Nessun file multimediale presente.</p>
            )}

            {/* FILE DI TESTO */}
            <h5 className="mt-4">File di Testo</h5>
            {capsula.textFiles && capsula.textFiles.length > 0 ? (
              <ul>
                {capsula.textFiles.map((file, index) => {
                  const fileUrl = file?.url || ""; // Assumi che ogni oggetto 'file' abbia una proprietà 'url'
                  return (
                    <li key={index}>
                      <a
                        href={fileUrl}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Scarica {fileUrl.split("/").pop()}{" "}
                        {/* Estrai solo il nome del file */}
                      </a>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p>Nessun file di testo presente.</p>
            )}
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}
export default Capsula;
