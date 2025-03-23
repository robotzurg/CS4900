import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Container, Row, Col } from "react-bootstrap";
import MainNavbar from "../../components/MainNavbar";
import { fetchAll, fetchById } from "../../services/api";
import MusicListGrid from "../../components/MusicListGrid";
import { Flex } from "@mantine/core";

interface User {
  id: string;
  bio: string;
  username: string;
  friends_list: Array<string>;
  profile_picture?: string | null;
}

const ProfilePage = () => {
  const { userId } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [songs, setSongs] = useState<any[]>([]);

  useEffect(() => {
    fetchAll("songs").then(setSongs).catch(console.error);
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
      <MainNavbar />
      <Container className="mt-4">
        <Row className="d-flex p-3">
          <Col lg={8}>
            <Row className="d-flex flex-column justify-content-center pb-40">
              <Flex className="align-items-end gap-4">
                <img src="https://www.gravatar.com/avatar/?d=mp" alt="Default profile picture icon"></img>
                <h2><strong>{user.username}</strong></h2>
              </Flex>
              <p className="pt-20">{user.bio || "User has not written a bio yet."} </p>
            </Row>
            <Row>
              <h2><strong>Song Reviews</strong></h2>
                <div>
                  <MusicListGrid musicList={songs} entity="songs"></MusicListGrid>
                </div>
            </Row>
          </Col>
          <Col lg={4} className="bg-gray">
            <p>Sidebar content (add later)</p>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ProfilePage;
