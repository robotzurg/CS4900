import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Helmet } from "react-helmet";
import { fetchById, getMusicReviews } from "../../services";
import MusicInfoCard from "../../components/MusicInfoCard";

function MusicPage({ entity }: { entity: string }) {
  const { musicId } = useParams(); 
  const [music, setMusic] = useState<any | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [userReview, setUserReview] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUserId(userData?.id || null);
    }
  }, []);

  useEffect(() => {
    if (!musicId) return;

    const fetchMusicDataAndReviews = async () => {
      try {
        const [musicData] = await Promise.all([
          fetchById(entity, musicId)
        ]);

        setMusic(musicData);

        const [reviewsData] = await Promise.all([
            getMusicReviews(entity, musicId)
        ]);

        if (userId) {
          setUserReview(reviewsData.filter(r => r.user_id === userId));
          setReviews(reviewsData.filter(r => r.user_id !== userId));
        } else {
          setUserReview([]);
          setReviews(reviewsData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMusicDataAndReviews();
  }, [musicId, userId]);

  if (loading) return <p>Loading...</p>;
  if (!music) return <p>{entity} not found</p>;

  return (
    <div>
      <Helmet>
        <title>{music?.name} - Waveform</title>
        <meta property="og:title" content={`${music?.name} by ${music?.artists.map(a => a.name).join(' & ')}`} />
        <meta property="og:description" content={`Listen to ${music?.name} by ${music?.artists.map(a => a.name)}. Read reviews and more!`} />
        <meta property="og:image" content={music?.image_url} />
        <meta property="og:image:width" content="300" />
        <meta property="og:image:height" content="300" />
        <meta property="og:type" content="music.song" />
      </Helmet>

      <MusicInfoCard music={music} reviews={reviews} userReview={userReview} />
    </div>
  );
}

export default MusicPage;