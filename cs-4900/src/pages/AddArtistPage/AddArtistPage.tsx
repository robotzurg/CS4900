import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Image,
} from "react-bootstrap";
import { Helmet } from "react-helmet";
import { uploadImage, createItem } from "../../services/generic.ts";

const MAX_FILE_SIZE = 5 * 1024 * 1024;  // 5 MB
const MAX_WIDTH     = 512;              
const MAX_HEIGHT    = 512;              

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

  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      return alert(`Image must be under ${MAX_FILE_SIZE / 1024 / 1024} MB.`);
    }

    const previewUrl = URL.createObjectURL(file);
    const img = new window.Image();
    img.src = previewUrl;
    img.onload = () => {
      if (img.width > MAX_WIDTH || img.height > MAX_HEIGHT) {
        URL.revokeObjectURL(previewUrl);
        return alert(`Dimensions must be ≤ ${MAX_WIDTH}x${MAX_HEIGHT}px.`);
      }
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
        profile_image: profileUrl,
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

              {/* Social Links */}
              <Form.Group controlId="spotify_url" className="mb-3">
                <Form.Label>Spotify URL</Form.Label>
                <Form.Control
                  name="spotify_url"
                  type="url"
                  value={formData.spotify_url}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="soundcloud_url" className="mb-3">
                <Form.Label>SoundCloud URL</Form.Label>
                <Form.Control
                  name="soundcloud_url"
                  type="url"
                  value={formData.soundcloud_url}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="twitter_url" className="mb-3">
                <Form.Label>Twitter URL</Form.Label>
                <Form.Control
                  name="twitter_url"
                  type="url"
                  value={formData.twitter_url}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="instagram_url" className="mb-3">
                <Form.Label>Instagram URL</Form.Label>
                <Form.Control
                  name="instagram_url"
                  type="url"
                  value={formData.instagram_url}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="youtube_url" className="mb-3">
                <Form.Label>Youtube URL</Form.Label>
                <Form.Control
                  name="youtube_url"
                  type="url"
                  value={formData.youtube_url}
                  onChange={handleChange}
                />
              </Form.Group>

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
