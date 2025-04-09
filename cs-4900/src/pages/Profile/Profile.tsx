import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Container, Row, Col, Image, Button } from "react-bootstrap";
import { fetchAll, fetchById, updateUser } from "../../services/index";
import { Flex } from "@mantine/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import ReviewListGrid from "../../components/ReviewListGrid";
import EditProfileModal from "../../components/EditProfileModal";

const ProfilePage = () => {
  const { userId } = useParams<string>();
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");
  const isOwnProfile = currentUser?.id === userId;
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<any[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const handleModalClose = () => setShowEditModal(false);
  const handleModalShow = () => setShowEditModal(true);

  useEffect(() => {
    if (!userId) return;
    fetchAll("reviews", [["userId", userId], ["type", "song"]]).then(setReviews).catch(console.error);
  }, []);

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
              <p className="pt-20">{user.bio || "User has not written a bio yet."} </p>
              {isOwnProfile && (
                <Flex direction={'column'} gap={15}>
                  <Flex gap={15}>
                    <Button>Connect to Spotify</Button>
                    <Button>Connect to Last.fm</Button> 
                    <Button>Connect to Discord</Button>
                  </Flex>
                  <Flex>
                    <Button variant="secondary" onClick={handleModalShow}>
                      Edit <FontAwesomeIcon icon={faEdit} />
                    </Button>
                  </Flex>
                </Flex>
              )}
            </Row>
            <Row>
              <h2><strong>Song Reviews</strong></h2>
                <div>
                  <ReviewListGrid reviews={reviews}></ReviewListGrid>
                </div>
            </Row>
          </Col>
          <Col lg={4} className="bg-gray">
            <div style={{ minHeight: '500px', backgroundColor: '#f0f0f0', borderRadius: '8px', padding: '20px' }}>
              <p>Sidebar content (add later)</p>
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
