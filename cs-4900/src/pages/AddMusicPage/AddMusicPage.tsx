import React, { useState, useEffect } from "react";
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

interface Artist { id: string; name: string; }
// interface Genre  { id: string; name: string; }

const AddMusicPage: React.FC = () => {
  const [formData, setFormData] = useState<{
    itemType: "song" | "album";
    name: string;
    artist_ids: string[];
    genre_ids: string[];
    musicFile: File | null;
    coverFile: File | null;
    coverPreview: string;
    releaseDate: string;
  }>({
    itemType: "song",
    name: "",
    artist_ids: [],
    genre_ids: [],
    musicFile: null,
    coverFile: null,
    coverPreview: "",
    releaseDate: "",
  });
  const [artists, setArtists] = useState<Artist[]>([]);
  //const [genres,  setGenres]  = useState<Genre[]>([]);
  const [loading, setLoading] = useState(false);

  // fetch artists + genres once
  useEffect(() => {
    fetchAll("artists").then(setArtists).catch(console.error);
    //fetchAll("genres").then(setGenres).catch(console.error);
  }, []);

  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMultiSelect = (
      e: React.ChangeEvent<HTMLSelectElement>
    ) => {
      const target = e.target as HTMLSelectElement;
      const { name, options } = target;
      const vals = Array.from(options)
        .filter((o) => o.selected)
        .map((o) => o.value);
      setFormData((prev) => ({ ...prev, [name]: vals }));
    };

  const handleCoverChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setFormData((prev) => ({
      ...prev,
      coverFile: file,
      coverPreview: preview,
    }));
  };

  const handleMusicChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, musicFile: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1) upload cover
      let coverUrl: any | null = formData.coverPreview;
      if (formData.coverFile) {
        const res = await uploadImage(formData.coverFile);
        coverUrl = typeof res === "string" ? res : res.url || null;
      }

      // 2) upload song file (if song)
      let musicUrl: any | null = "";
      if (formData.itemType === "song" && formData.musicFile) {
        const res = await uploadImage(formData.musicFile);
        musicUrl = typeof res === "string" ? res : res.url || null;
      }

      // 3) build endpoint + payload
      const endpoint = formData.itemType === "song" ? "songs" : "albums";
      const payload: any = {
        name:       formData.name,
        artist_ids: formData.artist_ids,
        genre_ids:  formData.genre_ids,
        image_url:  coverUrl,
      };
      if (formData.itemType === "song") {
        payload.music_url = musicUrl;
      } else {
        payload.release_date = formData.releaseDate;
      }

      const created = await createItem(endpoint, payload);
      // redirect to detail page
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
        <title>Add Music – Waveform</title>
      </Helmet>
      <Container className="mt-4">
        <Row className="p-3">
          <Col lg={8}>
            <h2>Add New Music</h2>
            <Form onSubmit={handleSubmit}>
              {/* Type */}
              <Form.Group controlId="itemType" className="mb-3">
                <Form.Label>Type</Form.Label>
                <Form.Select
                  name="itemType"
                  value={formData.itemType}
                  onChange={handleChange}
                >
                  <option value="song">Song</option>
                  <option value="album">Album</option>
                </Form.Select>
              </Form.Group>

              {/* Name */}
              <Form.Group controlId="name" className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              {/* multi‑select artists */}
              <Form.Group controlId="artists" className="mb-3">
                <Form.Label>Artist(s)</Form.Label>
                <Form.Control
                  as="select"
                  multiple
                  name="artist_ids"
                  value={formData.artist_ids}
                  onChange={(e) => handleMultiSelect(e as unknown as React.ChangeEvent<HTMLSelectElement>)}
                  required
                >
                  {artists.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              {/* multi‑select genres */}
              {/* <Form.Group controlId="genres" className="mb-3">
                <Form.Label>Genre(s)</Form.Label>
                <Form.Control
                  as="select"
                  multiple
                  name="genre_ids"
                  value={formData.genre_ids}
                  onChange={handleMultiSelect}
                  required
                >
                  {genres.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group> */}

              {/* song file if song */}
              {formData.itemType === "song" && (
                <Form.Group controlId="musicFile" className="mb-3">
                  <Form.Label>Audio File</Form.Label>
                  <Form.Control
                    type="file"
                    accept="audio/*"
                    onChange={handleMusicChange}
                    required
                  />
                </Form.Group>
              )}

              {/* release date if album */}
              {formData.itemType === "album" && (
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
              )}

              {/* cover upload + preview */}
              <Form.Group controlId="coverImage" className="mb-3">
                <Form.Label>Cover Image</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleCoverChange}
                />
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
                {loading
                  ? `Creating ${formData.itemType}…`
                  : `Create ${formData.itemType === "song" ? "Song" : "Album"}`}
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AddMusicPage;
