import { Card, Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function ChooseCapsule() {
  const navigate = useNavigate(); //Hook per la navigazione

  return (
    <>
      <Container className="mb-3">
        <h5 className="titoli-sezioni">Crea le tue Caps</h5>

        <Row>
          <Col xs={6} md={4} lg={3}>
            <Card
              border="secondary"
              className="card-home"
              onClick={() =>
                navigate("/create-capsula", {
                  state: { tipoCapsula: "PERSONALE" } // Passa il tipo di capsula come state
                })
              }
            >
              <Card.Header className="p-1 ps-3 header-pers d-flex justify-content-between align-items-center">
                Personale{" "}
                <img
                  src="/iconeGenerali/profilo.svg"
                  alt="profilo Icon"
                  style={{ width: 15, height: 15 }}
                  className="me-2"
                />
              </Card.Header>
              <Card.Body className="p-0">
                <img
                  src="/immagini_caps/capsula_3.jpeg"
                  alt="capsula 3"
                  className="img-fluid"
                />
              </Card.Body>
            </Card>
          </Col>

          <Col xs={6} md={4} lg={3}>
            <Card
              border="secondary"
              className="card-home"
              onClick={() =>
                navigate("/create-capsula", {
                  state: { tipoCapsula: "GRUPPO" } // Passa il tipo di capsula come state
                })
              }
            >
              <Card.Header className="p-1 ps-3 header-pers d-flex justify-content-between align-items-center">
                Di gruppo{" "}
                <img
                  src="/iconeGenerali/gruppo.svg"
                  alt="profilo Icon"
                  style={{ width: 15, height: 15 }}
                  className="me-2"
                />
              </Card.Header>
              <Card.Body className="p-0">
                <img
                  src="/immagini_caps/capsula_20.jpeg"
                  alt="capsula 20"
                  className="img-fluid"
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default ChooseCapsule;
