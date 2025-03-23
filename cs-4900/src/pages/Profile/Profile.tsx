import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Card, Button, Container } from "react-bootstrap";
import MainNavbar from "../../components/MainNavbar";
import { fetchById } from "../../services/api";

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
      <Container className="d-flex justify-content-center align-items-center min-vh-100 bg-dark text-white">
        <Card className="w-50 p-4 shadow-lg bg-secondary text-center">
          <Card.Img variant="top" src={user.profile_picture || "/default-avatar.png"} className="rounded-circle w-25 mx-auto" />
          <Card.Body>
            <Card.Title>{user.username}</Card.Title>
            <Card.Text>{user.bio || "No bio available."}</Card.Text>
            {user.friends_list && user.friends_list.length > 0 && (
              <div className="d-flex flex-wrap justify-content-center gap-2 mt-3">
                {user.friends_list.map((friend, index) => (
                  <span key={index} className="badge bg-light text-dark">{friend}</span>
                ))}
              </div>
            )}
            <Button variant="primary" className="mt-4 w-100">Edit Profile</Button>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default ProfilePage;
