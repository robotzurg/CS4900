// src/pages/Genres.tsx
import { useState } from "react";
import { fetchAll } from "../../services/index.ts";
import "./Genres.css";
import { Container, Button } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { Flex } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

function Genres() {
  const [visibleCount, setVisibleCount] = useState(25);
  const navigate = useNavigate();
  const handleLoadMore = () => setVisibleCount((prev) => prev + 25);

  const { data: genreList, isLoading, error } = useQuery({
    queryKey: ['genres', 'list'],
    queryFn: () => fetchAll('genres'), 
  });

  if (!genreList && isLoading) {
    return <div>Loading…</div>;
  }

  if (!genreList || error || !Array.isArray(genreList) || genreList.length === 0) {
    return <div>No genre found.</div>;
  }

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
