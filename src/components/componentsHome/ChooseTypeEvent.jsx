import { Card, Col, Container, Row } from "react-bootstrap";

function ChooseTypeEvent() {
  return (
    //Aggiungere effetti di hover
    <>
      <Container>
        <h5 className="titoli-sezioni">Crea un Evento</h5>
        <Row>
          <Col xs={6} md={4} lg={3}>
            <Card border="secondary" className="card-home">
              <Card.Header className="p-1 ps-3 header-pers">Locale</Card.Header>
              <Card.Body className="p-0">
                <img
                  src="/immaginiChooseEvents/Local.jpeg"
                  alt="evento locale"
                  className="img-fluid"
                />
              </Card.Body>
            </Card>
          </Col>

          <Col xs={6} md={4} lg={3}>
            <Card border="secondary" className="card-home">
              <Card.Header className="p-1 ps-3 header-pers">
                Globale
              </Card.Header>
              <Card.Body className="p-0">
                <img
                  src="/immaginiChooseEvents/Globe.jpeg"
                  alt="Evento globale"
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

export default ChooseTypeEvent;
