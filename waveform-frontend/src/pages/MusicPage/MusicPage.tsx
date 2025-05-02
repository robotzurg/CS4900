import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Helmet } from "react-helmet";
import { fetchById, getMusicReviews } from "../../services";
import MusicInfoCard from "../../components/MusicInfoCard/MusicInfoCard";

function MusicPage({ entity }: { entity: string }) {
  const { musicId } = useParams<{ musicId: string }>();
  const [music, setMusic] = useState<any | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [userReview, setUserReview] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const u = JSON.parse(stored);
      setUserId(u?.id ?? null);
    }
  }, []);

  useEffect(() => {
    if (!musicId) return;

    const load = async () => {
      try {
        const musicData = await fetchById(entity, musicId);
        setMusic(musicData);

        const reviewsData = await getMusicReviews(entity, musicId);
        const yours = userId ? reviewsData.filter(r => r.user_id === userId) : [];
        const others = userId ? reviewsData.filter(r => r.user_id !== userId) : reviewsData;

        setUserReview(yours);
        setReviews(others);
      } catch (err) {
        console.error("Error fetching music or reviews:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [entity, musicId, userId]);

  if (loading) {
    return <p>Loading…</p>;
  }

  if (music.error) window.location.href = '/';

  return (
    <div>
      <Helmet>
        <title>{music.name} - Waveform</title>
      </Helmet>

      <MusicInfoCard
        music={music}
        reviews={reviews}
        userReview={userReview}
      />
    </div>
  );
}

export default MusicPage;
