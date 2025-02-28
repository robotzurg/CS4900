import { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { Autocomplete } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import MainNavbar from "../../components/MainNavbar";
import "./CreateReview.css";

function CreateReview() {
    const [review, setReview] = useState({
        song: "",
        artist: "",
        rating: "",
        reviewText: "",
        email: "",
    });

    const [songSuggestions, setSongSuggestions] = useState<string[]>([]);
    const [artistSuggestions, setArtistSuggestions] = useState<string[]>([]);
    const [debouncedSong] = useDebouncedValue(review.song, 300);
    const [debouncedArtist] = useDebouncedValue(review.artist, 300);

    // Fetch song suggestions from API
    const fetchSongs = async (query: string) => {
        if (!query) return setSongSuggestions([]);
        const response = await fetch(`/api/songs?query=${query}`);
        const data = await response.json();
        setSongSuggestions(data.map((song: any) => song.title)); // Adjust based on API response
    };

    // Fetch artist suggestions from API
    const fetchArtists = async (query: string) => {
        if (!query) return setArtistSuggestions([]);
        const response = await fetch(`/api/artists?query=${query}`);
        const data = await response.json();
        setArtistSuggestions(data.map((artist: any) => artist.name)); // Adjust based on API response
    };

    // Handle changes
    const handleChange = (field: string, value: string) => {
        setReview((prev) => ({ ...prev, [field]: value }));
    };

    // Fetch suggestions when user types
    useState(() => {
        fetchSongs(debouncedSong);
        fetchArtists(debouncedArtist);
    }, [debouncedSong, debouncedArtist]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Submitted Review:", review);
        // API call to submit review
    };

    return (
        <div>
            <MainNavbar />
            <Container className="my-4">
                <h2>Write A Review</h2>
                <Form onSubmit={handleSubmit}>

                    {/* Song Input with Autocomplete */}
                    <Form.Group className="mb-3">
                        <Form.Label>Song</Form.Label>
                        <Autocomplete
                            value={review.song}
                            onChange={(value) => handleChange("song", value)}
                            data={songSuggestions}
                            placeholder="Type a song..."
                        />
                    </Form.Group>

                    {/* Artist Input with Autocomplete */}
                    <Form.Group className="mb-3">
                        <Form.Label>Artist</Form.Label>
                        <Autocomplete
                            value={review.artist}
                            onChange={(value) => handleChange("artist", value)}
                            data={artistSuggestions}
                            placeholder="Type an artist..."
                        />
                    </Form.Group>

                    {/* Rating */}
                    <Form.Group className="mb-3">
                        <Form.Label>Rating (1-5)</Form.Label>
                        <Form.Control 
                            type="number" 
                            name="rating"
                            min="1" 
                            max="5" 
                            onChange={(e) => handleChange("rating", e.target.value)}
                            required
                        />
                    </Form.Group>

                    {/* Review Text */}
                    <Form.Group className="mb-3">
                        <Form.Label>Review</Form.Label>
                        <Form.Control 
                            as="textarea" 
                            rows={3} 
                            name="reviewText"
                            onChange={(e) => handleChange("reviewText", e.target.value)}
                            required
                        />
                    </Form.Group>

                    {/* Email */}
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control 
                            type="email" 
                            name="email"
                            placeholder="Enter email" 
                            onChange={(e) => handleChange("email", e.target.value)}
                            required
                        />
                        <Form.Text className="text-muted">
                            We'll never share your email with anyone else.
                        </Form.Text>
                    </Form.Group>

                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
            </Container>
        </div>
    );
}

export default CreateReview;
