import { useState, useEffect } from "react";
import MainNavbar from "../../components/MainNavbar.tsx";
import { fetchAll } from "../../services/api.ts";
import "./Songs.css";
import MusicListGrid from "../../components/MusicListGrid.tsx";
import { Container } from "react-bootstrap";

function Songs() {
  const [songs, setSongs] = useState<any[]>([]);

  useEffect(() => {
    fetchAll("songs").then(setSongs).catch(console.error);
  }, []);

  return (
    <div>
      <MainNavbar />
      <Container>
        <h3 className='pt-20 pb-20 text-capitalize'>All Songs</h3>
        <MusicListGrid musicList={songs} entity="songs"></MusicListGrid>
      </Container>
      
    </div>
  );
}

export default Songs;