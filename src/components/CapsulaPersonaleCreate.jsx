import MyNavBar from "./MyNavBar";
import { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import api from "../api/api"; // Importo Axios configurato

//🚩🚩🚩 dopo l'invio cancellare il form

function CapsulaPersonaleCreate() {
  const idUtente = JSON.parse(localStorage.getItem("user")).id;
  const [formData, setFormData] = useState({
    title: "",
    openDate: "",
    email: "",
    media: [],
    textFiles: [], // Nuovo campo per i file di testo
    message: "", // Nuovo campo per il testo scritto manualmente
    pubblica: false,
    idUtente: idUtente
  });

  // Funzione per gestire i cambiamenti nei campi di input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Funzione per gestire il caricamento dei file
  const handleFileUpload = (e) => {
    const selectedFiles = Array.from(e.target.files).map((file) => ({
      id: crypto.randomUUID(), // Genera un ID univoco per ogni file. ATTENZIONE non ha nulla a che vedere con il db. è solo un id temporaneo.
      name: file.name, // Nome originale del file
      type: file.type, // Tipo MIME del file (es. "image/png", "video/mp4")
      file // Mantiene il file originale
    }));

    setFormData((prev) => ({
      ...prev,
      media: [
        ...prev.media,
        ...selectedFiles.filter(
          (f) => f.type.startsWith("image/") || f.type.startsWith("video/")
        )
      ],
      textFiles: [
        ...prev.textFiles,
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

  // Funzione per inviare il form
  const handleSubmit = (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("title", formData.title);
    form.append("openDate", formData.openDate);
    form.append("email", formData.email);
    form.append("message", formData.message);
    form.append("pubblica", formData.pubblica);
    form.append("idUtente", formData.idUtente);

    formData.media.forEach((file) => form.append("media", file.file));
    formData.textFiles.forEach((file) => form.append("textFiles", file.file)); // file.file si riferisce al file che l'utente ha caricato, che è contenuto nell'oggetto file e che deve essere inviato tramite il FormData

    api
      .post("/create-personal", form)
      .then((res) => {
        if (res.status === 200) {
          alert("Capsula creata con successo!");
          // Reset del form dopo l'invio
          setFormData({
            title: "",
            openDate: "",
            email: "",
            media: [],
            textFiles: [],
            message: "",
            pubblica: false,
            idUtente: idUtente
          });
        }
      })
      .catch((error) => {
        console.error("Errore durante la creazione della capsula:", error);
      });
  };

  const removeFile = (fileId, type) => {
    setFormData((prev) => ({
      ...prev,
      media:
        type === "image" ? removeFileFromList(prev.media, fileId) : prev.media,
      textFiles:
        type === "text"
          ? removeFileFromList(prev.textFiles, fileId)
          : prev.textFiles
    }));
  };

  const removeFileFromList = (list, fileId) => {
    return list.filter((file) => file.id !== fileId);
  };

  const handleSwitchChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      pubblica: e.target.checked // ✅ Aggiorna lo stato in base a `checked`
    }));
  };

  return (
    <>
      <MyNavBar />
      {/* --------------------- */}

      <Container className="mt-4 px-4">
        <div className=" form-capsula-div mb-3">
          <h4>Riempi la tua Capsula</h4>
          <Form onSubmit={handleSubmit}>
            {/* Titolo */}
            <Form.Group className="mb-3 form-text">
              <Form.Label>Titolo</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Inserisci il titolo"
                required
              />
            </Form.Group>

            {/* Data di apertura */}
            <Form.Group className="mb-3 form-text">
              <Form.Label>Data di Apertura</Form.Label>
              <Form.Control
                type="date"
                name="openDate"
                value={formData.openDate}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* Email */}
            <Form.Group className="mb-3 form-text">
              <Form.Label>
                Email{" "}
                <span className="disclaimer">
                  (Ti avvisiamo noi quando potrai aprire la tua capsula)
                </span>
              </Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Inserisci la tua email"
                required
              />
            </Form.Group>

            {/* Testo scritto manualmente */}
            <Form.Group className="mb-3 form-text">
              <Form.Label>Scrivi un messaggio</Form.Label>
              <Form.Control
                as="textarea"
                rows={10}
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Scrivi un messaggio da conservare nella capsula... "
                spellCheck="false" // Disabilita il correttore ortografico
                maxLength={10000} // Limite massimo di 10000 caratteri
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
                onClick={() => document.getElementById("fileInput").click()} //è un modo per "simulare" un click sull'input type="file" nascosto, quando l'utente preme il bottone.
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

            {/* Pulsante di invio */}
            <div className="d-flex justify-content-center my-4">
              <Button variant="primary" type="submit" className="bottone-crea">
                Crea Capsula
              </Button>
            </div>
          </Form>
        </div>

        {formData.media.length > 0 || formData.textFiles.length > 0 ? (
          <div className=" form-capsula-div mb-3">
            {/* Mostra i file caricati */}
            <h6>I tuoi caricamenti</h6>
            {formData.media.length > 0 && (
              <ul className="mt-1">
                {formData.media.map((file, index) => (
                  <li key={index} className="d-flex align-items-center">
                    <Button
                      size="sm"
                      className="me-2 cancel-btn bottone-crea"
                      onClick={() => removeFile(file.id, "image")}
                    >
                      X
                    </Button>
                    {/* Visualizza l'immagine */}
                    <img
                      src={URL.createObjectURL(file.file)} //Qui devo usare file.file invece di file perchè per avere l'id
                      //ho cambiato l'oggetto file in handleFileUpload e non è più compatibile.
                      //Tuttavia avendo messo anche il file vero e proprio nel nuovo oggetto glielo posso passare con file.file.
                      alt={file.name}
                      style={{ width: 40, height: 40, objectFit: "cover" }}
                      className="me-2"
                    />
                  </li>
                ))}
              </ul>
            )}
            {formData.textFiles.length > 0 && (
              <ul className="">
                {formData.textFiles.map((file, index) => (
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
      </Container>
    </>
  );
}

export default CapsulaPersonaleCreate;
