import { Card } from "react-bootstrap";
import { useEffect, useState } from "react";
import { fetchById } from "../services/api";
import { Link } from "react-router-dom";

function ArtistCard({ artistId }: { artistId: string }) {
  const [artist, setArtist] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!artistId) return;

    const getArtist = async () => {
      try {
        const data = await fetchById("artists", artistId);
        setArtist(data);
      } catch (error) {
        console.error("Error fetching artist:", error);
      } finally {
        setLoading(false);
      }
    };

    getArtist();
  }, [artistId]);

  if (loading) return <p>Loading...</p>;
  if (!artist) return <p>Artist not found</p>;

  return (
    <Card className="border-0 shadow p-0 text-center" style={{ width: "12rem", maxWidth: "12rem" }}>
      <Link to={`/artists/${artistId}`} style={{ textDecoration: "none", color: "inherit" }}>
        <Card.Img
          variant="top"
          src={artist.image_url || "https://www.gravatar.com/avatar/?d=mp"}
          alt={artist.name}
          className="rounded-circle mt-3"
          style={{ width: "80px", height: "80px", objectFit: "cover" }}
        />
        <Card.Body>
          <Card.Title className="fw-bold">{artist.name}</Card.Title>
        </Card.Body>
      </Link>
    </Card>
  );
}

export default ArtistCard;
