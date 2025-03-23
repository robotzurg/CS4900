import { Container } from "react-bootstrap";
import MainNavbar from "../../components/MainNavbar";
import './Home.css';
import { Helmet } from "react-helmet-async";

function Home() {
  return (
    <div>
      <Helmet>
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Waveform - Review Music" />
        <meta property="og:description" content="Review and discover music and connect with others on Waveform" />
        <meta property="og:url" content="https://waveformreviews.net" />
        <meta property="og:image" content="../../images/new-waveform-logo.png" />
      </Helmet>
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
