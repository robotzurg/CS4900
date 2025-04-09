import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { onSearch } from "../../services/index";
import MusicListGrid from "../../components/MusicListGrid";
import { useSearchParams } from "react-router-dom";
import PersonListGrid from "../../components/PersonListGrid";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q");
  
  const [songResults, setSongResults] = useState<any[]>([]);
  const [artistResults, setArtistResults] = useState<any[]>([]);
  const [albumResults, setAlbumResults] = useState<any[]>([]);
  const [userResults, setUserResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchQuery) {
      handleSearch(searchQuery);
    }
  }, [searchQuery]);

  const handleSearch = async (query: string) => {
    setLoading(true);
    try {
      const [songs, artists, albums, users] = await Promise.all([
        onSearch(query, "songs"),
        onSearch(query, "artists"),
        onSearch(query, "albums"),
        onSearch(query, "users"),
      ]);
      
      setSongResults(songs);
      setArtistResults(artists);
      setAlbumResults(albums);
      setUserResults(users);
    } catch (error) {
      console.error("Error searching:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Container className="mt-4">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            <h1 className="pb-40">Search Results for "{searchQuery}"</h1>
            
            <section className="mb-40">
              <h2>Songs</h2>
              <MusicListGrid musicList={songResults} entity="songs" />
            </section>

            <section className="mb-40">
              <h2>Albums</h2>
              <MusicListGrid musicList={albumResults} entity="albums" />
            </section>

            <section>
              <h2>Artists</h2>
              <PersonListGrid personList={artistResults} entity="artists" />
            </section>

            <section>
              <h2>Users</h2>
              <PersonListGrid personList={userResults} entity="users" />
            </section>

          </div>
        )}
      </Container>
    </div>
  );
};

export default SearchPage;
