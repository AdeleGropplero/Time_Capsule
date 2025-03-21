import { Card, Container } from "react-bootstrap";
import MyNavBar from "./MyNavBar";
import api from "../api/api"; // Importo Axios configurato
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";
import Slider from "react-slick";

function LeMieCaps() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [capsule, setCapsule] = useState([]);

  useEffect(() => {
    api
      .get(`/le-mie-caps/${user.id}`)
      .then((res) => {
        if (res.status === 200) {
          setCapsule(res.data);
          console.log(res.data);
        }
      })
      .catch((error) =>
        console.error("Errore nella fetch delle capsule: ", error)
      );
  }, [user.id]);

  // Filtro le capsule in base alla tipologia
  const capPersonali = capsule.filter((cap) => cap.capsula === "PERSONALE");
  const capGruppo = capsule.filter((cap) => cap.capsula === "GRUPPO");
  const capEvento = capsule.filter((cap) => cap.capsula === "EVENTO");

  // Impostazioni del carosello
  const getSliderSettings = (listaCapsule) => ({
    dots: true,
    infinite: listaCapsule.length > 1,
    speed: 500,
    slidesToShow: Math.min(listaCapsule.length, 2),
    slidesToScroll: 1,
    arrows: true
  });

  const generateCard = (listaCapsule) => {
    if (listaCapsule.length === 0) return <p>Nessuna capsula presente.</p>;

    return (
      <div className="slider-container">
        <Slider {...getSliderSettings(listaCapsule)}>
          {listaCapsule.map((cap) => (
            <Card
              key={cap.id}
              className="laMiaCard"
              onClick={() => navigate(`/capsula/${cap.id}`)}
            >
              <Card.Body>
                <img
                  src={`/immagini_caps/capsula_${
                    Math.floor(Math.random() * 20) + 1
                  }.jpeg`}
                  alt="img capsula"
                  className="img-fluid mb-2"
                />
                <Card.Title>{cap.title}</Card.Title>
                <Card.Text>Si apre il: {cap.openDate}</Card.Text>
              </Card.Body>
            </Card>
          ))}
        </Slider>
      </div>
    );
  };

  return (
    <>
      <MyNavBar />
      <Container>
        <h4 className="text-center mt-3">
          Benvenuto {user.fullName}, ecco le tue caps!
        </h4>
        <p className="mt-3">Capsule Personali</p>
        {generateCard(capPersonali)}
        <p className="mt-3">Capsule Gruppo</p>
        {generateCard(capGruppo)}
        <p className="mt-3">Capsule Evento</p>
        {generateCard(capEvento)}
      </Container>
    </>
  );
}

export default LeMieCaps;
