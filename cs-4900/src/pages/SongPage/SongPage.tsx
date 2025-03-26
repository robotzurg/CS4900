import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { fetchById, fetchAll } from "../../services/index";
import MainNavbar from "../../components/MainNavbar";
import MusicInfoCard from "../../components/MusicInfoCard";
import ReviewListGrid from "../../components/ReviewListGrid";

function SongPage() {
  const { songId } = useParams(); 
  const [song, setSong] = useState<any | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!songId) return;

    const fetchSongAndReviews = async () => {
      try {
        const [songData, reviewsData] = await Promise.all([
          fetchById('songs', songId),
          fetchAll('reviews', [['musicId', songId], ['type', 'song'], ['userType', 'critic']])
        ]);
        setSong(songData);
        setReviews(reviewsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSongAndReviews();
  }, [songId]);

  if (loading) return <p>Loading...</p>;
  if (!song) return <p>Song not found</p>;

  return (
    <div>
      <MainNavbar />
      <MusicInfoCard music={song} />
      <ReviewListGrid reviews={reviews} />
    </div>
  );
}

export default SongPage;
