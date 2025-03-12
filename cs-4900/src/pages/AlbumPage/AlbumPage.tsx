import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { fetchById } from "../../services/api";

import MainNavbar from "../../components/MainNavbar";
import './AlbumPage.css';
import MusicInfoCard from "../../components/MusicInfoCard";

function AlbumPage() {
  const { albumId } = useParams(); // Extract albumId from useParams hook
  const [album, setAlbum] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!albumId) return;

    const getalbum = async () => {
      try {
        const data = await fetchById('albums', albumId);
        setAlbum(data);
      } catch (error) {
        console.error("Error fetching album:", error);
      } finally {
        setLoading(false);
      }
    };

    getalbum();
  }, [albumId]); 

  if (loading) return <p>Loading...</p>;
  if (!album) return <p>Album not found</p>;

  return (
    <div>
      <MainNavbar />
      <MusicInfoCard music={album} />
    </div>
  );
}

export default AlbumPage;
