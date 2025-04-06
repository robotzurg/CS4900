import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { fetchById, fetchMe } from "../../services";
import MusicInfoCard from "../../components/MusicInfoCard";
import ReviewListGrid from "../../components/ReviewListGrid";

function MusicPage({ entity }: { entity: string }) {
  const { musicId } = useParams(); 
  const [music, setMusic] = useState<any | null>(null);
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
    if (!musicId || !userId) return;

    const fetchMusicDataAndReviews = async () => {
      try {
        const [musicData] = await Promise.all([
          fetchById(entity, musicId)
        ]);

        setMusic(musicData);

        const [reviewsData] = await Promise.all([
            fetchById("reviews", musicId, [["type", musicData.category]])
        ])

        setReviews(reviewsData.filter(r => r.user_id !== userId));
        setUserReview(reviewsData.filter(r => r.user_id === userId));
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

  const allReviews = [...userReview, ...reviews];
  const averageRating = 
  allReviews.length > 0
    ? allReviews.reduce((acc, review) => acc + (parseFloat(review.rating) || 0), 0) / allReviews.length
    : 0;

  return (
    <div>
      <MusicInfoCard music={music} userReview={userReview} averageRating={averageRating} />
      {(userReview.length > 0) && <ReviewListGrid type={"user_main"} reviews={userReview} />}
      <ReviewListGrid reviews={reviews} type={"users"} />
    </div>
  );
}

export default MusicPage;
