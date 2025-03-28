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
  const [immaginiCaps, setImmaginiCaps] = useState([]);

  useEffect(() => {
    api
      .get(`/le-mie-caps/${user.id}`)
      .then((res) => {
        if (res.status === 200) {
          setCapsule(res.data);
        }
      })
      .catch((error) =>
        console.error("Errore nella fetch delle capsule: ", error)
      );
  }, [user.id]);

  useEffect(() => {
    api
      .get("/immagini_caps")
      .then((res) => {
        if (res.status === 200) {
          /* console.log(res.data); */
          setImmaginiCaps(res.data);
        }
      })
      .catch((error) =>
        console.error("Errore nella fetch delle immagini: ", error)
      );
  }, []);

  // Filtro le capsule in base alla tipologia
  const capPersonali = capsule.filter((cap) => cap.capsula === "PERSONALE");
  const capGruppo = capsule.filter((cap) => cap.capsula === "GRUPPO");
  const capEvento = capsule.filter((cap) => cap.capsula === "EVENTO");

  // Impostazioni del carosello
  const getSliderSettings = (listaCapsule) => {
    const isSingleItem = listaCapsule.length <= 1; // Verifica se ci sono meno di due capsule

    return {
      dots: !isSingleItem, // Mostra i puntini solo se ci sono più di una capsula
      infinite: false,
      speed: 500,
      slidesToShow: Math.min(listaCapsule.length, 5), // Max 5 capsule per riga
      slidesToScroll: 1,
      arrows: true,
      responsive: [
        {
          breakpoint: 1800,
          settings: {
            slidesToShow: Math.min(listaCapsule.length, 5) // Limita il numero di slide in base alla lista
          }
        },
        {
          breakpoint: 1600,
          settings: {
            slidesToShow: Math.min(listaCapsule.length, 4)
          }
        },
        {
          breakpoint: 1200,
          settings: {
            slidesToShow: Math.min(listaCapsule.length, 4)
          }
        },
        {
          breakpoint: 992,
          settings: {
            slidesToShow: Math.min(listaCapsule.length, 3)
          }
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: Math.min(listaCapsule.length, 2)
          }
        },
        {
          breakpoint: 576,
          settings: {
            slidesToShow: Math.min(listaCapsule.length, 1)
          }
        }
      ]
    };
  };

  const generateCard = (listaCapsule) => {
    if (listaCapsule.length === 0) return null;

    return (
      <div className="slider-leMieCaps text-center">
        <Slider {...getSliderSettings(listaCapsule)}>
          {listaCapsule.map((cap) => (
            <div key={cap.id} className="ti-prego-centrati">
              <Card
                className="laMiaCard m-3"
                onClick={() => navigate(`/capsula/${cap.id}`)}
              >
                <Card.Body>
                  <img
                    src={immaginiCaps[Math.floor(Math.random() * 19)].url} // Usa l'URL dell'immagine casuale
                    alt="img capsula"
                    className="img-fluid mb-2"
                  />
                  {console.log(
                    immaginiCaps[Math.floor(Math.random() * 19)].url
                  )}
                  <Card.Title>{cap.title}</Card.Title>
                  <Card.Text>Si apre il: {cap.openDate}</Card.Text>
                </Card.Body>
              </Card>
            </div>
          ))}
        </Slider>
      </div>
    );
  };

  return (
    <>
      <MyNavBar />
      <Container className="container-leMieCaps pb-5 mb-5">
        {capPersonali.length > 0 && (
          <>
            <h4 className="mt-4 text-center">Capsule Personali</h4>
            {generateCard(capPersonali)}
          </>
        )}

        {capGruppo.length > 0 && (
          <>
            <h4 className="mt-4 text-center">Capsule Gruppo</h4>
            {generateCard(capGruppo)}
          </>
        )}

        {capEvento.length > 0 && (
          <>
            <h4 className="mt-4 text-center">Capsule Evento</h4>
            {generateCard(capEvento)}
          </>
        )}
      </Container>
    </>
  );
}

export default LeMieCaps;
