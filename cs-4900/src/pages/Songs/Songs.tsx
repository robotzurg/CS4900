import { useState, useEffect } from "react";
import MainNavbar from "../../components/MainNavbar.tsx";
import { fetchAll } from "../../services/api.ts";
import "./Songs.css";
import MusicListGrid from "../../components/MusicListGrid.tsx";

function Songs() {
  const [songs, setSongs] = useState<any[]>([]);

  useEffect(() => {
    fetchAll("songs").then(setSongs).catch(console.error);
  }, []);

  return (
    <div>
      <MainNavbar />
      <MusicListGrid musicList={songs} entity="songs"></MusicListGrid>
    </div>
  );
}

export default Songs;