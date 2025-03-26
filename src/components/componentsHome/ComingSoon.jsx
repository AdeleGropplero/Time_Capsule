import { Container } from "react-bootstrap";
import CaroselloEventi from "./CaroselloEventi";
import ChooseTypeEvent from "./ChooseTypeEvent";

function ComingSoon() {
  return (
    <>
      <Container
        fluid
        className="justify-content-center container-home comingSoon mt-5"
      >
        <p className="text-center">Coming Soon</p>
        <ChooseTypeEvent />
        <CaroselloEventi />
      </Container>
    </>
  );
}

export default ComingSoon;
