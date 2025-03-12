import { useState, useEffect } from "react";
import MainNavbar from "../../components/MainNavbar.tsx";
import { fetchAll } from "../../services/api.ts";
import "./Albums.css";
import MusicListGrid from "../../components/MusicListGrid.tsx";

function Albums() {
  const [albums, setAlbums] = useState<any[]>([]);

  useEffect(() => {
    fetchAll("albums").then(setAlbums).catch(console.error);
  }, []);

  return (
    <div>
      <MainNavbar />
      <MusicListGrid musicList={albums} entity="albums"></MusicListGrid>
    </div>
  );
}

export default Albums;