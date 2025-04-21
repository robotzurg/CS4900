import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchAll, fetchById } from "../../services";
import MusicListGrid from "../../components/MusicListGrid/MusicListGrid";
import { Container } from "react-bootstrap";
import { Helmet } from "react-helmet";

function GenrePage() {
  const { genreId } = useParams();
  const [genreSongs, setGenreSongs] = useState<any[]>([]);
  const [genreAlbums, setGenreAlbums] = useState<any[]>([]);
  const [genre, setGenre] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGenreItems = async () => {
      try {
        const songs = await fetchAll("songs", [["genreId", genreId || ""]]);
        const albums = await fetchAll("albums", [["genreId", genreId || ""]]);
        const genreData = await fetchById("genres", genreId || "");
        setGenreSongs(songs);
        setGenreAlbums(albums);
        setGenre(genreData);
      } catch (err) {
        console.error("Failed to fetch genre data", err);
      } finally {
        setLoading(false);
      }
    };

    if (genreId) fetchGenreItems();
  }, [genreId]);

  if (loading) {
    return null;
  }

  return (
    <Container className="pt-3">
      <Helmet>
        <title>{genre?.name} - Waveform</title>
      </Helmet>
      <h2 className="mb-4 text-capitalize">{genre.name}</h2>

      {genreSongs.length > 0 && (
        <>
          <h4>Songs</h4>
          <MusicListGrid musicList={genreSongs} entity="songs" />
        </>
      )}

      {genreAlbums.length > 0 && (
        <>
          <h4>Albums</h4>
          <MusicListGrid musicList={genreAlbums} entity="albums" />
        </>
      )}

      {genreSongs.length === 0 && genreAlbums.length === 0 && (
        <p>No music found in this genre.</p>
      )}
    </Container>
  );
}

export default GenrePage;
