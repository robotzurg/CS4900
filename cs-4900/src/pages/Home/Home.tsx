import { Container } from "react-bootstrap";
import MainNavbar from "../../components/MainNavbar";
import './Home.css';

function Home() {
  return (
    <div>
      <MainNavbar />
      <Container>
        <h1 className="pt-40">Welcome to Waveform!</h1>
        <div>
            <p>Waveform is a music review website. Work in progress!</p>
            <p>Click on the View Songs tab to view songs.</p>
        </div>
      </Container>
    </div>
  );
}

export default Home;
