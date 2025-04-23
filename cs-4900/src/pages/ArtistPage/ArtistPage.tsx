import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { fetchById, fetchAll } from "../../services/index";
import MusicListGrid from "../../components/MusicListGrid/MusicListGrid";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { Helmet } from "react-helmet";

function ArtistPage() {
  const { artistId } = useParams(); 
  const [artist, setArtist] = useState<any | null>(null);
  const [songs, setSongs] = useState<any[]>([]);
  const [albums, setAlbums] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!artistId) return;

    const fetchArtistSongAlbumData = async () => {
      try {
        const [artistData, songsData, albumsData] = await Promise.all([
          fetchById("artists", artistId),
          fetchAll("songs", [["artistId", artistId]]),
          fetchAll("albums", [["artistId", artistId]]),
        ]);
        setArtist(artistData);
        setSongs(songsData);
        setAlbums(albumsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtistSongAlbumData();
  }, [artistId]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (artist.error) window.location.href = '/'

  return (
    <div>
      <Helmet>
        <title>{artist?.name} - Waveform</title>
      </Helmet>
      <Container className="mt-4">
        <Row className="justify-content-center">
            <Col className="">
                <div className="mt-4">
                    <img
                        src={artist.image_url || "https://www.gravatar.com/avatar/?d=mp"}
                        alt={artist.name}
                        className="rounded-circle"
                        style={{ width: "150px", height: "150px", objectFit: "cover" }}
                    />
                    <h2 className="mt-3">{artist.name}</h2>

                    <h3 className='pt-20 pb-20 text-capitalize'>All Songs</h3>
                    {songs.length > 0 ? (
                        <MusicListGrid list={songs} entity="songs" />
                    ) : (
                        <p>No songs found for this artist.</p>
                    )}

                    <h3 className='pt-20 pb-20 text-capitalize'>All Albums</h3>
                    {songs.length > 0 ? (
                        <MusicListGrid list={albums} entity="albums" />
                    ) : (
                        <p>No albums found for this artist.</p>
                    )}
                </div>
            </Col>
        </Row>
      </Container>
    </div>
  );
}

export default ArtistPage;
