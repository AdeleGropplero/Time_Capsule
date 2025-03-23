import React from "react";
import { Card, Container } from "react-bootstrap";
import Slider from "react-slick";

function CaroselloEventi() {
  const items = [
    //sarà cambiato con una fetch da database
    {
      id: 1,
      alt: "eurovision event",
      content: "immagini_evento/eurovision.jpeg"
    },
    { id: 2, alt: "mondiali event", content: "immagini_evento/mondiali.jpeg" },
    { id: 3, alt: "newYear event", content: "immagini_evento/newYear.jpeg" },
    {
      id: 4,
      alt: "olimpiadi event",
      content: "immagini_evento/olimpiadi.jpg"
    },
    { id: 5, alt: "oscars event", content: "immagini_evento/oscars.jpeg" },
    {
      id: 6,
      alt: "superbowl event",
      content: "immagini_evento/superbowl.jpeg"
    },
    { id: 7, alt: "tennis event", content: "immagini_evento/tennis.jpeg" }
  ];

  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    speed: 6000,
    autoplaySpeed: 1000,
    cssEase: "linear",
    arrows: false,
    responsive: [
      {
        breakpoint: 1800,
        settings: {
          slidesToShow: 5
        }
      },
      {
        breakpoint: 1600,
        settings: {
          slidesToShow: 5
        }
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 4
        }
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 3
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 2
        }
      }
    ]
  };

  return (
    <div className="slider-container ">
      <Container className="mt-3 mb-5 ">
        <h5 className="titoli-sezioni text-center">Gli eventi del momento</h5>
        <Slider {...settings} className="fade-carosello ">
          {items.map((item) => (
            <div key={item.id}>
              <Card border="secondary" className="card-home m-1">
                <Card.Body className="p-0">
                  <img
                    src={item.content}
                    alt={item.alt}
                    className="img-fluid"
                  />
                </Card.Body>
              </Card>
            </div>
          ))}
        </Slider>
      </Container>
    </div>
  );
}

export default CaroselloEventi;
