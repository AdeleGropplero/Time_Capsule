import { useState } from "react";
import { Form, Button, Container, Spinner, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../api/api"; // Importo Axios configurato

function Registration() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  // eslint-disable-next-line no-unused-vars
  const [errorMessage, setErrorMessage] = useState(""); // Stato per gestire il messaggio di errore
  const [isLoading, setIsLoading] = useState(false); // Stato per gestire il caricamento
  const [showPassword, setShowPassword] = useState(false); // Stato per mostrare/nascondere la password
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Stato per mostrare/nascondere la conferma della password

  // Funzione per gestire i cambiamenti nei campi di input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Funzione per inviare il form
  const handleSubmit = (e) => {
    e.preventDefault();

    // Reset dell'errore prima di inviare la richiesta
    setErrorMessage("");
    setIsLoading(true); // Attiva lo stato di caricamento

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Le password non corrispondono.");
      setIsLoading(false);
      return;
    }

    // INIZIO CHIAMATA POST PER REGISTRAZIONE
    api
      .post("/register", {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password
      })
      .then((response) => {
        console.log(response);
        navigate("/");
      })
      .catch((error) => {
        alert(error.message);
      })
      .finally(() => {
        setIsLoading(false); // Disattiva lo stato di caricamento
      });
  };

  return (
    <>
      <Container className="mt-4 px-4">
        <div className=" form-capsula-div mb-3">
          <h4>Registrati</h4>
          <Form onSubmit={handleSubmit}>
            {/* Nome */}
            <Form.Group className="mb-3 form-text">
              <Form.Label>Inserisci il tuo nome completo</Form.Label>
              <Form.Control
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Nome Cognome"
                required
              />
            </Form.Group>

            {/* Email */}
            <Form.Group className="mb-3 form-text">
              <Form.Label>Email </Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Inserisci la tua email"
                required
              />
            </Form.Group>

            {/* Password */}
            <Form.Group className="mb-3 form-text">
              <Form.Label>Inserisci la password</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showPassword ? "text" : "password"} // Mostra/nascondi la password
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="************"
                  required
                  minLength={8} // Imposta il minimo di 8 caratteri
                  isInvalid={
                    formData.password.length > 0 && formData.password.length < 8
                  } // Condizione per mostrare errore
                />
                <InputGroup.Text
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? (
                    <img src="/iconeGenerali/e-ye.svg" alt="nascondi" />
                  ) : (
                    <img src="/iconeGenerali/eye.svg" alt="mostra" />
                  )}
                </InputGroup.Text>
              </InputGroup>
              <Form.Control.Feedback type="invalid">
                La password deve essere di almeno 8 caratteri.
              </Form.Control.Feedback>
            </Form.Group>

            {/* Conferma Password */}
            <Form.Group className="mb-3 form-text">
              <Form.Label>Conferma la password</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showConfirmPassword ? "text" : "password"} // Mostra/nascondi la conferma della password
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="************"
                  required
                  minLength={8}
                  isInvalid={
                    formData.confirmPassword.length > 0 &&
                    formData.confirmPassword !== formData.password
                  }
                />
                <InputGroup.Text
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                >
                  {showConfirmPassword ? (
                    <img src="/iconeGenerali/e-ye.svg" alt="nascondi" />
                  ) : (
                    <img src="/iconeGenerali/eye.svg" alt="mostra" />
                  )}
                </InputGroup.Text>
              </InputGroup>
              <Form.Control.Feedback type="invalid">
                Le password non corrispondono.
              </Form.Control.Feedback>
            </Form.Group>

            <p className="go-register">
              Hai già un account?{" "}
              <a href="" onClick={() => navigate("/")}>
                Vai al login!
              </a>
            </p>

            <div className="d-flex justify-content-center my-4">
              <Button
                variant="primary"
                type="submit"
                className="bottone-crea"
                disabled={isLoading} // Disabilita il pulsante durante il caricamento
              >
                {isLoading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />{" "}
                    Caricamento...
                  </>
                ) : (
                  "Registrati"
                )}
              </Button>
            </div>
          </Form>
        </div>
      </Container>
    </>
  );
}

export default Registration;
