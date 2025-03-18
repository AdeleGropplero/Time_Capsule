import { useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../redux/reducers/authSlice"; // Importo le azioni del mio slice

function MyNavBar() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // Aggiungo uno stato per tenere traccia se il dropdown è chiuso o aperto.
  const [isDropOpen, setIsDropOpen] = useState(false);

  // f. per la gestione di apertura e chiusura del drop
  // isOpen è il parametro che assumerà il valore che assumerà il dropdown (true o false)
  const handleToggle = (isOpen) => setIsDropOpen(isOpen);

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container className="justify-content-between">
        <img
          src="/navbar/logo.svg"
          alt="time capsule logo"
          style={{ width: 80, height: 60, cursor: "pointer" }}
          onClick={() => navigate("/home")}
          className="me-1"
        />

        <Navbar.Brand
          href="#home"
          className="my-navbar-brand"
          onClick={() => navigate("/home")}
        >
          Time Capsule
        </Navbar.Brand>
        <Nav className="">
          <NavDropdown
            className="customDropdown"
            title={
              <img
                src={
                  isDropOpen
                    ? "/navbar/iconeSvg/capsulaAperta.svg"
                    : "/navbar/iconeSvg/capsulaChiusa.svg"
                }
                alt="Dropdown Icon"
                style={{ width: 36, height: 36 }}
              />
            }
            id="basic-nav-dropdown"
            onToggle={handleToggle} //richiamo la f. definita prima.
          >
            <NavDropdown.Item
              as={Link} // Usa Link per la navigazione
              to={`/profilo/${user?.id}`}
              className="nav-text-personalized"
            >
              <img
                src="/navbar/iconeSvg/profilo.svg"
                alt="profilo Icon"
                style={{ width: 30, height: 26 }}
                className="me-2 ps-1 "
              />
              Profilo
            </NavDropdown.Item>

            <NavDropdown.Item
              as={Link} // Usa Link per la navigazione
              to={`/le-mie-caps/${user?.id}`}
              className="nav-text-personalized"
            >
              <img
                src="/navbar/iconeSvg/myCaps.svg"
                alt="my caps Icon"
                style={{ width: 30, height: 26 }}
                className="me-1"
              />{" "}
              Le mie Caps
            </NavDropdown.Item>

            <NavDropdown.Item
              className="nav-text-personalized"
              onClick={() => {
                dispatch(logout());
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                navigate("/");
              }}
            >
              <img
                src="/navbar/iconeSvg/logout.svg"
                alt="logout"
                style={{ width: 30, height: 26 }}
                className="me-1"
              />{" "}
              Esci
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default MyNavBar;
