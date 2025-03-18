import { Card, Col, Container, Row } from "react-bootstrap";
import MyNavBar from "./MyNavBar";
import api from "../api/api"; // Importo Axios configurato
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";
import Slider from "react-slick";

function LeMieCaps() {
  //🚩🚩🚩 Sistemare responsivness carosello e card!!!!!! e ovviamente anche lo stile generale tipo i titoli ecc

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [capsule, setCapsule] = useState([]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 2,
    arrows: true,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />
  };

  function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{
          ...style
        }}
        onClick={onClick}
      />
    );
  }

  function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return <div className={className} style={{ ...style }} onClick={onClick} />;
  }

  useEffect(() => {
    api
      .get(`/le-mie-caps/${user.id}`)
      .then((res) => {
        if (res.status === 200) {
          setCapsule(res.data); //In Axios, res.data contiene il corpo della risposta ricevuta dal server
          console.log(res.data);
        }
      })
      .catch((error) =>
        console.error("Errore nella fetch delle capsule: ", error)
      );
  }, [user.id]);

  // Filtro le capsule in base alla tipologia
  const capPersonali = capsule.filter((cap) => cap.capsula === "PERSONALE");
  const capGruppo = capsule.filter((cap) => cap.capsula === "GRUPPO"); //Ancora da implementare lato back.
  const capEvento = capsule.filter((cap) => cap.capsula === "EVENTO"); //Ancora da implementare lato back.

  const generateCard = (nomeLista) => {
    return nomeLista.length > 0 ? (
      <div className="slider-container">
        <Slider {...settings}>
          {nomeLista.map((cap) => (
            <Card
              key={cap.id}
              className="laMiaCard"
              onClick={() => {
                navigate(`/capsula/${cap.id}`);
              }}
            >
              <Card.Body>
                <img
                  src={`/immagini_caps/capsula_${
                    Math.floor(Math.random() * 20) + 1
                  }.jpeg`} //{"/immagini_caps/capsula_" + randomN + ".jpeg"}
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
    ) : (
      <p>Nessuna capsula presente.</p>
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
