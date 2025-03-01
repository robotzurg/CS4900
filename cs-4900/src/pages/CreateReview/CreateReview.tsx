import { useState, useEffect } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { Autocomplete } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import MainNavbar from "../../components/MainNavbar";
import "./CreateReview.css";
import { searchByName } from "../../services/api.ts";

function CreateReview() {
    const [review, setReview] = useState({
        song: "",
        artist: "",
        rating: "",
        review: "",
        songId: "",
        artistId: ""
    });

    const [songSuggestions, setSongSuggestions] = useState<{ value: string; id: string }[]>([]);
    const [artistSuggestions, setArtistSuggestions] = useState<{ value: string; id: string }[]>([]);
    const [debouncedSong] = useDebouncedValue(review.song, 300);
    const [debouncedArtist] = useDebouncedValue(review.artist, 300);

    // Handle changes
    const handleChange = (field: string, value: string) => {
        setReview((prev) => ({ ...prev, [field]: value }));
    };

    useEffect(() => {
        if (debouncedSong) {
            searchByName("songs", debouncedSong).then((songs) =>
                setSongSuggestions(songs?.map((song: any) => ({ value: song.name, id: song.id })) || [])
            );
        } else {
            setSongSuggestions([]);
        }
    }, [debouncedSong]);

    useEffect(() => {
        if (debouncedArtist) {
            searchByName("artists", debouncedArtist).then((artists) =>
                setArtistSuggestions(artists?.map((artist: any) => ({ value: artist.name, id: artist.id })) || [])
            );
        } else {
            setArtistSuggestions([]);
        }
    }, [debouncedArtist]);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
    };

    return (
        <div>
            <MainNavbar />
            <Container className="my-4" style={{ width: '40%' }}>
                <h2>Write A Review</h2>
                <Form onSubmit={handleSubmit}>

                    {/* Song Input with Autocomplete */}
                    <Form.Group className="mb-3">
                        <Form.Label>Song</Form.Label>
                        <Autocomplete
                            value={review.song}
                            onChange={(value) => {
                                const selected = songSuggestions.find((s) => s.value === value);
                                setReview((prev) => ({
                                    ...prev,
                                    song: value,
                                    songId: selected?.id || "",
                                }));
                                console.log(review);
                            }}
                            data={songSuggestions}
                            placeholder="Type a song..."
                        />
                    </Form.Group>

                    {/* Artist Input with Autocomplete */}
                    <Form.Group className="mb-3">
                        <Form.Label>Artist</Form.Label>
                        <Autocomplete
                            value={review.artist}
                            onChange={(value) => {
                                const selected = artistSuggestions.find((a) => a.value === value);
                                setReview((prev) => ({
                                    ...prev,
                                    artist: value,
                                    artistId: selected?.id || "",
                                }));
                                console.log(review);
                            }}
                            data={artistSuggestions}
                            placeholder="Type an artist..."
                        />
                    </Form.Group>

                    {/* Rating */}
                    <Form.Group className="mb-3">
                        <Form.Label>Rating (1-10)</Form.Label>
                        <Form.Control 
                            type="number" 
                            name="rating"
                            min="1" 
                            max="10" 
                            onChange={(e) => handleChange("rating", e.target.value)}
                            required
                        />
                    </Form.Group>

                    {/* Review */}
                    <Form.Group className="mb-3">
                        <Form.Label>Review</Form.Label>
                        <Form.Control 
                            as="textarea" 
                            rows={3} 
                            name="review"
                            onChange={(e) => handleChange("review", e.target.value)}
                            required
                        />
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
