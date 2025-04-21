import { Routes, Route } from "react-router-dom";
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { useEffect } from "react";
import { Container } from "react-bootstrap";

// Import pages
import * as Pages from "./pages";

// Import components
import MainNavbar from "./components/MainNavbar/MainNavbar";
import MainFooter from "./components/MainFooter";

function App() {
  useEffect(() => {
    const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
    if (link) link.href = "https://www.waveformreviews.net/images/new-waveform-logo.png";
  }, []);

  return (
    <MantineProvider>
      <div className="d-flex flex-column min-vh-100">
        <MainNavbar />
        <Container className="flex-grow-1 py-4">
          <Routes>
            <Route path="/" element={<Pages.Home />} />
            <Route path="/songs" element={<Pages.MusicAll entity="songs" />} />
            <Route path="/songs/:musicId" element={<Pages.MusicPage entity="songs" />} />
            <Route path="/albums" element={<Pages.MusicAll entity="albums" />} />
            <Route path="/albums/:musicId" element={<Pages.MusicPage entity="albums" />} />
            <Route path="/artists" element={<Pages.Artists />} />
            <Route path="/artists/:artistId" element={<Pages.ArtistPage />} />
            <Route path="/users" element={<Pages.Users />} />
            <Route path="/profile/:userId" element={<Pages.ProfilePage />} />
            <Route path="/songs/:musicId/reviews/:reviewId" element={<Pages.ReviewPage />} />
            <Route path="/albums/:musicId/reviews/:reviewId" element={<Pages.ReviewPage />} />
            <Route path="/genres" element={<Pages.Genres />} />
            <Route path="/genres/:genreId" element={<Pages.GenrePage />} />
            <Route path="/create-profile" element={<Pages.CreateProfilePage />} />
            <Route path="/add-music/:musicType" element={<Pages.AddMusicPage />} />
            <Route path="/add-genre" element={<Pages.AddGenrePage />} />
            <Route path="/add-artist" element={<Pages.AddArtistPage />} />
            <Route path="/results" element={<Pages.SearchPage />} />
            <Route path="/support" element={<Pages.Support />} />
            <Route path="/tos" element={<Pages.Tos />} />
            <Route path="/privacy" element={<Pages.Privacy />} />
            <Route path="*" element={<Pages.NotFound />} />
          </Routes>
        </Container>
        <MainFooter /> 
      </div>
    </MantineProvider>
  );
}

export default App;
