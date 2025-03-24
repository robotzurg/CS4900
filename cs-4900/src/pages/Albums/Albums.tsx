import { useState, useEffect } from "react";
import MainNavbar from "../../components/MainNavbar.tsx";
import { fetchAll } from "../../services/api.ts";
import "./Albums.css";
import MusicListGrid from "../../components/MusicListGrid.tsx";
import { Container } from "react-bootstrap";

function Albums() {
  const [albums, setAlbums] = useState<any[]>([]);

  useEffect(() => {
    fetchAll("albums").then(setAlbums).catch(console.error);
  }, []);

  return (
    <div>
      <MainNavbar />
      <Container>
        <h3 className='pt-20 pb-20 text-capitalize'>All Albums</h3>
        <MusicListGrid musicList={albums} entity="albums"></MusicListGrid>
      </Container>
    </div>
  );
}

export default Albums;