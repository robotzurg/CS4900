import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
} from "react-bootstrap";

import { Helmet } from "react-helmet";
import { createItem, fetchAll } from "../../services/generic.ts";
import { MultiSelect } from "@mantine/core";

const AddGenrePage: React.FC = () => {
const [formData, setFormData] = useState<{
  name: string;
  song_ids: string[];
  album_ids: string[];
}>({
  name: "",
  song_ids: [],
  album_ids: [],
});

const [songs, setSongs] = useState<any[]>([]);
const [albums, setAlbums] = useState<any[]>([]);
const [loading, setLoading] = useState(false);

useEffect(() => {
  fetchAll("songs").then(setSongs).catch(console.error);
  fetchAll("albums").then(setAlbums).catch(console.error);
}, []);

const handleChange = (e: React.ChangeEvent<any>) => {
  const { name, value } = e.target;
  setFormData((prev) => ({ ...prev, [name]: value }));
};

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    const payload = {
      name: formData.name,
      songIds: formData.song_ids,
      albumIds: formData.album_ids
    };

    const created = await createItem("genres", payload);

    window.location.href = `/genres/${created.id}`;
  } catch (err) {
    console.error(err);
    alert("Error creating genre");
  } finally {
    setLoading(false);
  }
};

return (
  <div>
    <Helmet>
      <title>Add Genre - Waveform</title>
    </Helmet>
    <Container className="mt-4">
      <Row className="p-3">
        <Col lg={8}>
          <h2>Add New Genre</h2>
          <Form onSubmit={handleSubmit}>

            {/* Name */}
            <Form.Group controlId="name" className="mb-3">
              <Form.Label>Genre Name</Form.Label>
              <Form.Control
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* Multi‑Select Songs */}
            <Form.Group controlId="songs" className="mb-3">
              <Form.Label>Assign to Songs</Form.Label>
              <MultiSelect
                placeholder="Pick Songs"
                data={songs.map((s) => ({ value: s.id, label: s.name }))}
                value={formData.song_ids}
                onChange={(values) =>
                  setFormData((prev) => ({ ...prev, song_ids: values }))
                }
                searchable
              />
            </Form.Group>

            {/* Multi‑Select Albums */}
            <Form.Group controlId="albums" className="mb-3">
              <Form.Label>Assign to Albums</Form.Label>
              <MultiSelect
                placeholder="Pick Albums"
                data={albums.map((a) => ({ value: a.id, label: a.name }))}
                value={formData.album_ids}
                onChange={(values) =>
                  setFormData((prev) => ({ ...prev, album_ids: values }))
                }
                searchable
              />
            </Form.Group>

            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? "Creating Genre…" : "Create Genre"}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  </div>
);
};

export default AddGenrePage;