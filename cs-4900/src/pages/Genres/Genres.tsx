import { useState, useEffect } from "react";
import { fetchAll } from "../../services/index.ts";
import "./Genres.css";
import { Container, Button } from "react-bootstrap";

function Genres() {
  const [genreList, setGenreList] = useState<any[]>([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const handleLoadMore = () => setVisibleCount(prev => prev + 10);

  useEffect(() => {
    fetchAll("genres").then(setGenreList).catch(console.error);
  }, []);

  return (
    <div>
      <Container>
        <h3 className="pt-20 pb-20 text-capitalize">Genres</h3>
        <div className="genre-list">
          {genreList.slice(0, visibleCount).map((genre, index) => (
            <Button
              key={index}
              variant="outline-secondary"
              className="m-2 text-capitalize"
              onClick={() => window.location.href = `/genres/${genre.id}`}
            >
              {genre.name}
            </Button>
          ))}
        </div>
        {visibleCount < genreList.length && (
          <div className="text-center mt-3">
            <button className="btn btn-outline-primary" onClick={handleLoadMore}>
              Show More
            </button>
          </div>
        )}
      </Container>
    </div>
  );
}

export default Genres;