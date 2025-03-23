import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { fetchById, fetchAll } from "../../services/api";
import MainNavbar from "../../components/MainNavbar";
import MusicInfoCard from "../../components/MusicInfoCard";
import ReviewListGrid from "../../components/ReviewListGrid";
import { Helmet } from "react-helmet-async";

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
          fetchAll('reviews', [['musicId', songId], ['type', 'song']])
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
      <Helmet>
        <meta property="og:type" content="music.song" />
        <meta property="og:title" content={song.title} />
        <meta property="og:description" content={"See reviews for this song on Waveform"} />
        <meta property="og:url" content={`https://www.waveformreviews.net/songs/${song.id}`} />
        <meta property="og:image" content={song.image_url} />
      </Helmet>
      <MainNavbar />
      <MusicInfoCard music={song} />
      <ReviewListGrid reviews={reviews} />
    </div>
  );
}

export default SongPage;
