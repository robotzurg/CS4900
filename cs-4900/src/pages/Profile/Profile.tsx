import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Container, Row, Col, Image, Button } from "react-bootstrap";
import { fetchAll, fetchById, updateUser } from "../../services/index";
import { Flex } from "@mantine/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import EditProfileModal from "../../components/EditProfileModal";
import BigReviewCard from "../../components/BigReviewCard";
import Topster from "../../components/Topster";

const ProfilePage = () => {
  const { userId } = useParams<string>();
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");
  const isOwnProfile = currentUser?.id === userId;
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  let [reviews, setReviews] = useState<any[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  
  const handleModalClose = () => setShowEditModal(false);
  const handleModalShow = () => setShowEditModal(true);

  // Fetch reviews and enrich each with music details.
  useEffect(() => {
    if (!userId) return;
    fetchAll("reviews", [["userId", userId]])
      .then(async (fetchedReviews) => {
        const enrichedReviews = await Promise.all(
          fetchedReviews.map(async (review: any) => {
            const musicId = review.song_id || review.album_id;
            const endpoint = review.song_id ? "songs" : "albums";
            try {
              const musicData = await fetchById(endpoint, musicId);
              return { ...review, music: musicData };
            } catch (error) {
              console.error(`Error fetching music details for review ${review.id}:`, error);
              return review;
            }
          })
        );
        setReviews(enrichedReviews);
      })
      .catch(console.error);
  }, [userId]);

  // Fetch user profile data.
  useEffect(() => {
    if (!userId) return;
    const fetchUser = async () => {
      try {
        const userData = await fetchById("users", userId);
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>User not found</p>;

  let reviewsFiltered = reviews.filter((r) => !isNaN(parseFloat(r.rating)));
  let averageRating = reviewsFiltered.reduce((acc, r) => acc + parseFloat(r.rating), 0) / reviewsFiltered.length || 0;

  const recentReviews = [...reviews]
  .sort((a, b) =>
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )
  .slice(0, 3);


  return (
    <div>
      <Container className="mt-4">
        <Row className="d-flex p-3">
          <Col lg={8}>
            <Row className="d-flex flex-column justify-content-center pb-40">
              <Flex className="align-items-end gap-4">
                <Image 
                  src={user.profile_picture || "https://www.gravatar.com/avatar/?d=mp"} 
                  alt={user.username} 
                  className="me-2" 
                  roundedCircle 
                  width={150} 
                  height={150} 
                />
                <h2><strong>{user.username}</strong></h2>
              </Flex>
              <p className="pt-20">{user.bio || "User has not written a bio yet."}</p>
              {isOwnProfile && (
                <Flex direction={'column'} gap={15}>
                  {/* <Flex gap={15}>
                    <Button>Connect to Spotify</Button>
                    <Button>Connect to Last.fm</Button> 
                    <Button>Connect to Discord</Button>
                  </Flex> */}
                  <Flex>
                    <Button variant="secondary" onClick={handleModalShow}>
                      Edit <FontAwesomeIcon icon={faEdit} />
                    </Button>
                  </Flex>
                </Flex>
              )}
            </Row>
            <Row>
              <h2><strong>Recent Reviews</strong></h2>
              <div>
                {recentReviews.length ? (
                  recentReviews.map((review) => (
                    <BigReviewCard 
                      key={review.id}
                      review={review}
                      user={user}
                      music={review.music} 
                    />
                  ))
                ) : (
                  <p>No reviews available</p>
                )}
              </div>
            </Row>
          </Col>
          <Col lg={4} className="bg-gray">
            <div style={{ minHeight: '500px', backgroundColor: '#f0f0f0', borderRadius: '8px', padding: '20px' }}>
            <div className="mb-20">
                <h4><strong>Topster</strong></h4>
                <Topster />
              </div>
            {reviews.length > 0 ? (
              <>
                <h5 className="mb-10"><strong>Statistics</strong></h5>
                <p><strong>Reviews:</strong> {reviews.length}<br />
                <strong>Average Rating:</strong> {
                  (
                    averageRating
                  ).toFixed(1).toString().replace(/\.0+$/, "")
                }</p>
              </>
            ) : (
              <>
                <p>No review stats yet.</p>
              </>
            )}

            </div>
          </Col>
        </Row>
      </Container>
      <EditProfileModal
        show={showEditModal}
        handleClose={handleModalClose}
        userData={{ ...user, profile_picture: user.profile_picture || undefined }}
        onSubmit={async (updatedData) => {
          console.log(updatedData);
          const updatedUser = {
            ...user,
            ...updatedData,
            profile_picture: updatedData.profile_picture ?? null,
          };
          try {
            await updateUser(updatedUser);
            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));
            window.location.reload();
          } catch (error) {
            console.error("Failed to update user:", error);
          }
        }}
      />
    </div>
  );
};

export default ProfilePage;
