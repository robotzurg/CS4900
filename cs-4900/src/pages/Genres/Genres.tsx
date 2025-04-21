// src/pages/Genres.tsx
import { useState, useEffect } from "react";
import { fetchAll } from "../../services/index.ts";
import "./Genres.css";
import { Container, Button } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { Flex } from "@mantine/core";
import { useNavigate } from "react-router-dom";

function Genres() {
  const [genreList, setGenreList] = useState<any[]>([]);
  const [visibleCount, setVisibleCount] = useState(25);
  const navigate = useNavigate();
  const handleLoadMore = () => setVisibleCount((prev) => prev + 25);

  useEffect(() => {
    fetchAll("genres").then(setGenreList).catch(console.error);
  }, []);

  return (
    <div>
      <Helmet>
        <title>Genres - Waveform</title>
      </Helmet>
      <Container>
        <Flex justify="space-between" align="center" className="py-3">
          <h3 className="mb-0 text-capitalize">All Genres</h3>
          <Button variant="primary" onClick={() => navigate("/add-genre")}>
            + Add Genre
          </Button>
        </Flex>

        <div className="genre-list">
          {genreList.slice(0, visibleCount).map((genre, i) => (
            <Button
              key={i}
              variant="outline-secondary"
              className="m-2 text-capitalize"
              onClick={() => navigate(`/genres/${genre.id}`)}
            >
              {genre.name}
            </Button>
          ))}
        </div>

        {visibleCount < genreList.length && (
          <div className="text-center mt-3">
            <Button variant="outline-primary" onClick={handleLoadMore}>
              Show More
            </Button>
          </div>
        )}
      </Container>
    </div>
  );
}

export default Genres;
