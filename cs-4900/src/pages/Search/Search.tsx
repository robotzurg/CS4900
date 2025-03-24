import { useState, useEffect } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { onSearch } from "../../services/api";
import MainNavbar from "../../components/MainNavbar";
import MusicListGrid from "../../components/MusicListGrid";
import { useSearchParams } from "react-router-dom";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q");

  const [query, setQuery] = useState<string>(searchQuery != null ? searchQuery : "");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchQuery) {
      handleSearch(searchQuery); // Call handleSearch with searchQuery on mount
    }
  }, [searchQuery]);

  const handleSearch = async (query: string) => {
    setQuery(query); // Update state with the search query
    if (!query.trim()) return;
    setLoading(true);
    try {
      const searchResults = await onSearch(query, "songs");
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
        <Form className="d-flex justify-content-center mb-4" onSubmit={(e) => e.preventDefault()}>
          <Form.Control
            type="text"
            placeholder="Search for a song"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-50"
          />
          <Button variant="primary" onClick={() => handleSearch(query)} className="ms-2">
            Search
          </Button>
        </Form>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            {results.length > 0 ? (
              <MusicListGrid musicList={results} entity="songs" />
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
