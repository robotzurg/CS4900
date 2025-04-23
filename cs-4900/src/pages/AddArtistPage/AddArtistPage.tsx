import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Image,
  InputGroup,
} from "react-bootstrap";
import { Helmet } from "react-helmet";
import { uploadImage, createItem } from "../../services/generic.ts";
import {
  FaSpotify,
  FaSoundcloud,
  FaTwitter,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";

const MAX_FILE_SIZE = 5 * 1024 * 1024;  // 5 MB        

function AddArtistPage() {
  const [formData, setFormData] = useState<{
    name: string;
    profileFile: File | null;
    profilePreview: string;
    spotify_url: string;
    soundcloud_url: string;
    twitter_url: string;
    instagram_url: string;
    youtube_url: string;
  }>({
    name: "",
    profileFile: null,
    profilePreview: "",
    spotify_url: "",
    soundcloud_url: "",
    twitter_url: "",
    instagram_url: "",
    youtube_url: "",
  });

  const [loading, setLoading] = useState(false);
  
  const socialFields = [
    { name: "spotify_url", label: "Spotify", icon: <FaSpotify /> },
    { name: "soundcloud_url", label: "SoundCloud", icon: <FaSoundcloud /> },
    { name: "twitter_url", label: "Twitter", icon: <FaTwitter /> },
    { name: "instagram_url", label: "Instagram", icon: <FaInstagram /> },
    { name: "youtube_url", label: "YouTube", icon: <FaYoutube /> },
  ];
  
  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      return alert(`Image must be under ${MAX_FILE_SIZE / 1024 / 1024} MB.`);
    }

    const previewUrl = URL.createObjectURL(file);
    const img = new window.Image();
    img.src = previewUrl;
    img.onload = () => {
      setFormData((prev) => ({
        ...prev,
        profileFile: file,
        profilePreview: previewUrl,
      }));
    };
    img.onerror = () => {
      URL.revokeObjectURL(previewUrl);
      alert("Invalid image file.");
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let profileUrl: string | null = formData.profilePreview;
      if (!formData.profileFile) {
        profileUrl = "https://www.gravatar.com/avatar/?d=mp";
      } else {
        const res = await uploadImage(formData.profileFile);
        profileUrl = typeof res === "string" ? res : res.url || null;
      }

      const payload = {
        name: formData.name,
        image_url: profileUrl,
        spotify_url: formData.spotify_url || undefined,
        soundcloud_url: formData.soundcloud_url || undefined,
        twitter_url: formData.twitter_url || undefined,
        instagram_url: formData.instagram_url || undefined,
        youtube_url: formData.youtube_url || undefined,
      };

      const created = await createItem("artists", payload);
      window.location.href = `/artists/${created.id}`;
    } catch (err) {
      console.error(err);
      alert("Error creating artist");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Helmet>
        <title>Add Artist - Waveform</title>
      </Helmet>
      <Container className="mt-4">
        <Row className="p-3">
          <Col lg={8}>
            <h2>Add New Artist</h2>
            <Form onSubmit={handleSubmit}>
              {/* Name */}
              <Form.Group controlId="name" className="mb-3">
                <Form.Label>Artist Name</Form.Label>
                <Form.Control
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              {socialFields.map(({ name, label, icon }) => (
              <Form.Group controlId={name} className="mb-2" key={name}>
                <Form.Label className="mb-1">{label}</Form.Label>
                <InputGroup>
                  <InputGroup.Text>{icon}</InputGroup.Text>
                  <Form.Control
                    name={name}
                    type="url"  
                    placeholder={`Enter ${label} URL`}
                    value={formData[name]}
                    onChange={handleChange}
                  />
                </InputGroup>
              </Form.Group>
              ))}


              {/* Artist Image */}
              <Form.Group controlId="profileImage" className="mb-3">
                <Form.Label>Artist Image</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {formData.profilePreview && (
                  <Image
                    src={formData.profilePreview}
                    rounded
                    width={75}
                    height={75}
                    className="mt-2"
                  />
                )}
              </Form.Group>

              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? "Creating…" : "Create Artist"}
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AddArtistPage;
