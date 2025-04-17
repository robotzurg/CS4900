import { useState } from "react";
import { Container, Row, Col, Form, Button, Image } from "react-bootstrap";
import { updateUser } from "../../services/user.ts";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { uploadImage } from "../../services/generic.ts";

// Interface for user data
interface User {
  id: string | null;
  bio: string;
  username: string;
  friends_list: Array<string>;
  profile_picture: string | null; 
}

const CreateProfilePage = () => {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("id");
  let userProfilePic = searchParams.get("pic");
  let userName = searchParams.get("name");
  
  if (userProfilePic == null) userProfilePic = "";
  if (userName == null) userName = "";

  if (userId == null) {
    window.location.href = '/';
    return;
  }

  const [userData, setUserData] = useState<User>({
    id: userId,
    username: userName,
    bio: '',
    friends_list: [],
    profile_picture: userProfilePic,
  });

  const [loading, setLoading] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setSelectedImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setUserData((prevData) => ({
        ...prevData,
        profile_picture: previewUrl,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let finalProfilePicture = userData.profile_picture;

      if (selectedImageFile) {
        const response = await uploadImage(selectedImageFile);
        const url = typeof response === 'string' ? response : response.url;
        if (url) {
          finalProfilePicture = url;
        } else {
          alert("Failed to retrieve image URL");
        }
      }

      await updateUser({
        ...userData,
        profile_picture: finalProfilePicture,
      });

      window.location.href = `/profile/${userData.id}`;
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Helmet>
        <title>Create Profile - Waveform</title>
      </Helmet>
      <Container className="mt-4">
        <Row className="d-flex p-3">
          <Col lg={8}>
            <h2>Edit Profile Data</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="username" className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your username"
                  name="username"
                  value={userData.username}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId="bio" className="mb-3">
                <Form.Label>Bio</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Tell us about yourself"
                  name="bio"
                  value={userData.bio}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group controlId="profilePicture" className="mb-3">
                <Form.Label>Profile Picture</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {userData.profile_picture && (
                  <Image
                    src={userData.profile_picture}
                    alt="Profile preview"
                    roundedCircle
                    width={75}
                    height={75}
                    className="mt-2"
                  />
                )}
              </Form.Group>

              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Profile"}
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CreateProfilePage;
