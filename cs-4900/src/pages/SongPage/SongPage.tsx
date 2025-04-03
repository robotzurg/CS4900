import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { fetchById, fetchMe } from "../../services";
import MusicInfoCard from "../../components/MusicInfoCard";
import ReviewListGrid from "../../components/ReviewListGrid";

function SongPage() {
  const { songId } = useParams(); 
  const [song, setSong] = useState<any | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [userReview, setUserReview] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await fetchMe();
        setUserId(userData?.id || null);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (!songId || !userId) return;

    const fetchSongAndReviews = async () => {
      try {
        const [songData, reviewsData] = await Promise.all([
          fetchById("songs", songId),
          fetchById("reviews", songId, [["type", "song"]])
        ]);
        setSong(songData);
        setReviews(reviewsData.filter(r => r.user_id !== userId));
        setUserReview(reviewsData.filter(r => r.user_id === userId));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSongAndReviews();
  }, [songId, userId]);

  if (loading) return <p>Loading...</p>;
  if (!song) return <p>Song not found</p>;

  return (
    <div>
      <MusicInfoCard music={song} userReview={userReview} />
      {(userReview.length > 0) && <ReviewListGrid type={"user_main"} reviews={userReview} />}
      <ReviewListGrid reviews={reviews} type={"users"} />
    </div>
  );
}

export default SongPage;
