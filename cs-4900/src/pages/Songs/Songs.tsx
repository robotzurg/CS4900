import { useState, useEffect } from "react";
import MainNavbar from "../../components/MainNavbar.tsx";
import SongsGrid from "../../components/SongsGrid.tsx";
import { fetchAll } from "../../services/api.ts";
import "./Songs.css";

function Songs() {
  const [songs, setSongs] = useState<any[]>([]);

  useEffect(() => {
    fetchAll("songs").then(setSongs).catch(console.error);
  }, []);

  return (
    <div>
      <MainNavbar />
      <SongsGrid songs={songs}></SongsGrid>
    </div>
  );
}

export default Songs;