import { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { onSearch } from "../../services/api";
import MainNavbar from "../../components/MainNavbar";
import MusicListGrid from "../../components/MusicListGrid";

const SearchPage = () => {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (event) => {
    event.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const searchResults = await onSearch(query, "songs")
      setResults(searchResults);
    } catch (error) {
      console.error("Error searching:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <MainNavbar />
      <Container className="mt-5">
        <Form className="d-flex justify-content-center mb-4">
          <Form.Control
            type="text"
            placeholder="Search for a song"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-50"
          />
          <Button variant="primary" onClick={handleSearch} className="ms-2">
            Search
          </Button>
        </Form>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            {results.length > 0 ? (
              <MusicListGrid musicList={results} entity="songs"></MusicListGrid>
            ) : (
              <p>No results found</p>
            )}
          </div>
        )}
      </Container>
    </div>
  );
};

export default SearchPage;
