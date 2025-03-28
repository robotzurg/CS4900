import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { fetchById, fetchMe } from "../../services";
import MainNavbar from "../../components/MainNavbar";
import MusicInfoCard from "../../components/MusicInfoCard";
import ReviewListGrid from "../../components/ReviewListGrid";

function AlbumPage() {
  const { albumId } = useParams(); 
  const [album, setAlbum] = useState<any | null>(null);
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
    if (!albumId || !userId) return;

    const fetchAlbumAndReviews = async () => {
      try {
        const [albumData, reviewsData] = await Promise.all([
          fetchById("albums", albumId),
          fetchById("reviews", albumId, [["type", "album"]])
        ]);
        setAlbum(albumData);
        setReviews(reviewsData.filter(r => r.user_id !== userId));
        setUserReview(reviewsData.filter(r => r.user_id === userId));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbumAndReviews();
  }, [albumId, userId]);

  if (loading) return <p>Loading...</p>;
  if (!album) return <p>Album not found</p>;

  return (
    <div>
      <MainNavbar />
      <MusicInfoCard music={album} userReview={userReview} />
      {(userReview.length > 0) && <ReviewListGrid type={"user_main"} reviews={userReview} />}
      <ReviewListGrid reviews={reviews} type={"users"} />
    </div>
  );
}

export default AlbumPage;
