import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Image,
} from "react-bootstrap";
import { Helmet } from "react-helmet";
import {
  uploadImage,
  createItem,
  fetchAll,
} from "../../services/generic.ts";
import { MultiSelect } from "@mantine/core";
import { useParams } from "react-router";

const MAX_FILE_SIZE = 5 * 1024 * 1024;  // 5 MB
const MAX_WIDTH     = 512;
const MAX_HEIGHT    = 512;

function AddMusicPage() {
  const { musicType } = useParams<{ musicType: "song" | "album" }>();
  const itemType = musicType === "album" ? "album" : "song";

  const [formData, setFormData] = useState<{
    itemType: "song" | "album";
    name: string;
    artist_ids: string[];
    genre_ids: string[];
    coverFile: File | null;
    coverPreview: string;
    releaseDate: string;
  }>({
    itemType,
    name: "",
    artist_ids: [],
    genre_ids: [],
    coverFile: null,
    coverPreview: "",
    releaseDate: "",
  });

  const [artists, setArtists] = useState<any[]>([]);
  const [genres, setGenres] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAll("artists").then(setArtists).catch(console.error);
    fetchAll("genres").then(setGenres).catch(console.error);
  }, []);

  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) {
      alert(`Cover image must be under ${MAX_FILE_SIZE / 1024 / 1024} MB.`);
      return;
    }
    const previewUrl = URL.createObjectURL(file);
    const img = new window.Image();
    img.src = previewUrl;
    img.onload = () => {
      if (img.width > MAX_WIDTH || img.height > MAX_HEIGHT) {
        alert(`Cover must be ≤ ${MAX_WIDTH}x${MAX_HEIGHT}px.`);
        URL.revokeObjectURL(previewUrl);
        return;
      }
      setFormData(prev => ({ ...prev, coverFile: file, coverPreview: previewUrl }));
    };
    img.onerror = () => {
      alert("Invalid image file.");
      URL.revokeObjectURL(previewUrl);
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let coverUrl: string | null = formData.coverPreview;
      if (!formData.coverFile) {
        coverUrl = "https://f005.backblazeb2.com/file/waveform/default-cover-art.png";
      } else {
        const res = await uploadImage(formData.coverFile);
        coverUrl = typeof res === "string" ? res : res.url || null;
      }
      const endpoint = formData.itemType === "song" ? "songs" : "albums";
      const payload = {
        name: formData.name,
        artist_ids: formData.artist_ids,
        genre_ids: formData.genre_ids,
        image_url: coverUrl,
        release_date: formData.releaseDate,
      };
      const created = await createItem(endpoint, payload);
      window.location.href = `/${endpoint}/${created.id}`;
    } catch (err) {
      console.error(err);
      alert(`Error creating ${formData.itemType}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Helmet>
        <title>Add {itemType === "song" ? "Song" : "Album"} - Waveform</title>
      </Helmet>
      <Container className="mt-4">
        <Row className="p-3">
          <Col lg={8}>
            <h2>Add New {itemType === "song" ? "Song" : "Album"}</h2>
            <Form onSubmit={handleSubmit}>
              {/* Name */}
              <Form.Group controlId="name" className="mb-3">
                <Form.Label>{itemType === "song" ? "Song" : "Album"} Title</Form.Label>
                <Form.Control
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              {/* Artists */}
              <Form.Group controlId="artists" className="mb-3">
                <Form.Label>Artist(s)</Form.Label>
                <MultiSelect
                  placeholder="Pick Artists"
                  data={artists.map(a => ({ value: a.id, label: a.name }))}
                  value={formData.artist_ids}
                  onChange={vals => setFormData(prev => ({ ...prev, artist_ids: vals }))}
                  searchable
                  required
                />
              </Form.Group>

              {/* Genres */}
              <Form.Group controlId="genres" className="mb-3">
                <Form.Label>Genre(s)</Form.Label>
                <MultiSelect
                  placeholder="Pick Genres"
                  data={genres.map(g => ({ value: g.id, label: g.name }))}
                  value={formData.genre_ids}
                  onChange={vals => setFormData(prev => ({ ...prev, genre_ids: vals }))}
                  searchable
                  required
                />
              </Form.Group>

              {/* Release Date */}
              <Form.Group controlId="releaseDate" className="mb-3">
                <Form.Label>Release Date</Form.Label>
                <Form.Control
                  type="date"
                  name="releaseDate"
                  value={formData.releaseDate}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              {/* Cover */}
              <Form.Group controlId="coverImage" className="mb-3">
                <Form.Label>Cover Image</Form.Label>
                <Form.Control type="file" accept="image/*" onChange={handleCoverChange} />
                {formData.coverPreview && (
                  <Image
                    src={formData.coverPreview}
                    rounded
                    width={75}
                    height={75}
                    className="mt-2"
                  />
                )}
              </Form.Group>

              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? `Creating…` : `Create ${itemType === "song" ? "Song" : "Album"}`}
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AddMusicPage;