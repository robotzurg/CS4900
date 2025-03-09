import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { fetchById } from "../../services/api";

import MainNavbar from "../../components/MainNavbar";
import './SongPage.css';
import SongInfoCard from "../../components/SongInfoCard";

function SongPage() {
  const { songId } = useParams(); // Extract songId from useParams hook
  const [song, setSong] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!songId) return;

    const getSong = async () => {
      try {
        const data = await fetchById('songs', songId);
        setSong(data);
      } catch (error) {
        console.error("Error fetching song:", error);
      } finally {
        setLoading(false);
      }
    };

    getSong();
  }, [songId]); 

  if (loading) return <p>Loading...</p>;
  if (!song) return <p>Song not found</p>;

  return (
    <div>
      <MainNavbar />
      <SongInfoCard song={song} />
    </div>
  );
}

export default SongPage;
