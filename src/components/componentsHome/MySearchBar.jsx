import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import { Col, Container, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import api from "../../api/api"; // Importa Axios configurato

function MySearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = () => {
    console.log("Ricerca per: " + searchQuery);
    //Qui sarà inserita un action o la chiamata ad un API. Per es: *

    api
      .get("/search-bar", {
        params: { input: searchQuery }
      })
      .then((res) => {
        console.log("Risultati trovati:", res.data);
        setResults(res.data);
      })
      .catch((error) => {
        console.error("errore nella ricerca: ", error);
      });
  };

  useEffect(() => {
    if (searchQuery.trim() === "") return; // Evita ricerche vuote

    const delayDebounceFn = setTimeout(() => {
      handleSearch(searchQuery); // Esegui la ricerca dopo 500ms
    }, 500);

    return () => clearTimeout(delayDebounceFn); // Pulisce il timeout se l'utente continua a digitare
  }, [searchQuery]);

  return (
    <Row className="justify-content-center">
      <Col xs={12} md={8} lg={6}>
        <Container className="mt-3">
          <InputGroup onSubmit={handleSearch} className="mb-3 ">
            <Form.Control
              className="search-personalized"
              placeholder="Cerca una Caps o un evento"
              aria-label="search input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              /* onKeyDown={(e) => e.key === "Enter" && handleSearch()} */
            />
            <Button
              className="searchBtn"
              onClick={() => handleSearch(searchQuery)}
            >
              <img src="/iconeGenerali/search.svg" alt="lente ricerca" />
            </Button>
          </InputGroup>

          {/* Mostro i risultati solo se searchQuery non è vuoto */}
          {searchQuery.trim() && results.length > 0 && (
            <div className="search-results-container shadow-sm">
              <ul className="search-results-list list-unstyled">
                {results.map((capsula) => (
                  <li key={capsula.id} className="search-result-item">
                    <div className="d-flex align-items-center p-2">
                      <img
                        src="/iconeGenerali/capsula-icon-search.svg"
                        alt="icona capsula"
                        className="me-2"
                        style={{ width: "24px" }}
                      />
                      <div>
                        <div className="result-title">{capsula.title}</div>
                        <div className="result-meta">
                          <small className="text-muted">
                            Apre il:{" "}
                            {new Date(capsula.openDate).toLocaleDateString()}
                          </small>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {searchQuery && results.length === 0 && (
            <div className="search-results-container no-results p-3">
              Nessun risultato trovato per "{searchQuery}"
            </div>
          )}
        </Container>
      </Col>
    </Row>
  );
}

export default MySearchBar;

/* 
* const handleSearch = async () => {
  const response = await fetch(`https://api.example.com/search?query=${searchQuery}`);
  const data = await response.json();
  console.log(data);
};

*/
