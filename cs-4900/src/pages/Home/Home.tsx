import { Col, Container, Row, Image } from "react-bootstrap";
import './Home.css';
import { useEffect, useState } from "react";
import { fetchAll } from "../../services";
import MusicListGrid from "../../components/MusicListGrid/MusicListGrid";
import { Helmet } from "react-helmet";

function Home() {
  const [songs, setSongs] = useState<any[]>([]);
  const [albums, setAlbums] = useState<any[]>([]);

  useEffect(() => {
    fetchAll("songs").then(setSongs).catch(console.error);
    fetchAll("albums").then(setAlbums).catch(console.error);
  }, []);

  return (
    <div>
      <Helmet>
          <title>Waveform</title>
      </Helmet>
      <Container>
        <Row className="pb-40">
          <Col md={6} className="pl-40">
          <h1 className="pt-40 pb-20 bold">Welcome to Waveform!</h1>
          <p>Waveform is Music Review Discord Bot/Website designed to simplify the song review process whilst creating a fun and exciting way to view and see others opinions on the music you love to listen to.
            <br/><br/>We want to provide you with the best possible experience in reviewing music, and we hope that you will enjoy your time here on the website and with the discord bot. Now get to reviewing!</p>
          </Col>
          <Col md={6} className="d-flex justify-content-center">
          <Image 
            src={'../images/new-waveform-logo.png'} 
            alt="waveform logo" 
            className="me-2" 
            width={300} 
            height={300} 
          />
          </Col>
        </Row>

        <section>
          <h2 className="pt-10 pb-10 bold">Popular Songs</h2>
          <MusicListGrid musicList={songs.slice(0, 5)} entity="songs" />
        </section>

        <section>
          <h2 className="pt-10 pb-10 bold">Popular Albums</h2>
          <MusicListGrid musicList={albums.slice(0, 5)} entity="albums" />
        </section>
      </Container>
    </div>
  );
}

export default Home;