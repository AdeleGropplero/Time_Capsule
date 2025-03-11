import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import { Container } from "react-bootstrap";
import { useState } from "react";

function MySearchBar() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    console.log("Ricerca per: " + searchQuery);
    //Qui sarà inserita un action o la chiamata ad un API. Per es: *
  };

  return (
    <Container className="mt-3 px-5">
      <InputGroup className="mb-3 ">
        <Form.Control
          className="search-personalized"
          placeholder="Cerca una Caps o un evento"
          aria-label="search input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button className="searchBtn" onClick={handleSearch}>
          <img src="/iconeGenerali/search.svg" alt="lente ricerca" />
        </Button>
      </InputGroup>
    </Container>
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
