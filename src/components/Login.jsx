import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Form, Button, Container, Spinner, InputGroup } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { setToken, setUser } from "../redux/reducers/authSlice"; // Importo le azioni del mio slice
import api from "../api/api"; // Importo Axios configurato

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [isLoading, setIsLoading] = useState(false); // Stato per gestire il caricamento
  const [showPassword, setShowPassword] = useState(false); // Stato per mostrare/nascondere la password

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true); // Attiva lo stato di caricamento

    // Usa axios invece di fetch
    api
      .post("/", {
        email: formData.email,
        password: formData.password
      })
      .then((response) => {
        const data = response.data; // Dati ricevuti dal backend

        console.log("Dati ricevuti dal backend:", data);

        if (data && data.token) {
          console.log("token: " + data.token);
          dispatch(setToken(data.token));

          // Mi ssicuro che data contenga fullName e id prima di usarli
          if (data.fullName && data.id) {
            dispatch(
              setUser({
                fullName: data.fullName,
                id: data.id
              })
            );
          } else {
            console.error("Dati utente mancanti:", data);
          }

          localStorage.setItem("token", data.token);
          localStorage.setItem(
            "user",
            JSON.stringify({ fullName: data.fullName, id: data.id })
          ); // Salva nel localStorage i dati utente
          navigate("/home");
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 403) {
          // Password errata
          alert("Password o mail errata. Riprova.");
        } else {
          alert("Si è verificato un errore durante il login.");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <Container className="mt-4 px-4">
        <div className=" form-capsula-div mb-3">
          <h4>Login</h4>
          <Form onSubmit={handleSubmit}>
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

            <p className="go-register">
              Non hai un account?{" "}
              <a href="" onClick={() => navigate("/register")}>
                Vai alla registrazione!
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
                  "Entra"
                )}
              </Button>
            </div>
          </Form>
        </div>
      </Container>
    </>
  );
}

export default Login;
