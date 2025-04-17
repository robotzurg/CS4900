import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import MusicPage from "./pages/MusicPage/MusicPage";
import MusicAll from "./pages/MusicAll/MusicAll";
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import ProfilePage from "./pages/Profile/Profile";
import SearchPage from "./pages/Search/Search";
import Artists from "./pages/Artists/Artists";
import ArtistPage from "./pages/ArtistPage/ArtistPage";
import MainNavbar from "./components/MainNavbar";
import MainFooter from "./components/MainFooter";
import { useEffect } from "react";
import { Container } from "react-bootstrap";
import NotFound from "./pages/NotFound/NotFound";
import Support from "./pages/Support/Support";
import Tos from "./pages/Legal/Tos";
import Privacy from "./pages/Legal/Privacy";
import ReviewPage from "./pages/ReviewPage/ReviewPage";
import Users from "./pages/Users/Users";
import CreateProfilePage from "./pages/CreateProfilePage/CreateProfilePage";
import Genres from "./pages/Genres/Genres";
import GenrePage from "./pages/GenrePage/GenrePage";

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
            <Route path="/" element={<Home />} />
            <Route path="/songs" element={<MusicAll entity="songs" />} />
            <Route path="/songs/:musicId" element={<MusicPage entity="songs" />} />
            <Route path="/albums" element={<MusicAll entity="albums" />} />
            <Route path="/albums/:musicId" element={<MusicPage entity="albums" />} />
            <Route path="/artists" element={<Artists />} />
            <Route path="/artists/:artistId" element={<ArtistPage />} />
            <Route path="/users" element={<Users />} />
            <Route path="/profile/:userId" element={<ProfilePage />} />
            <Route path="/songs/:musicId/reviews/:reviewId" element={<ReviewPage />} />
            <Route path="/albums/:musicId/reviews/:reviewId" element={<ReviewPage />} />
            <Route path="/genres" element={<Genres />} />
            <Route path="/genres/:genreId" element={<GenrePage />} />
            <Route path="/create-profile" element={<CreateProfilePage />} />
            <Route path="/results" element={<SearchPage />} />
            <Route path="/support" element={<Support />} />
            <Route path="/tos" element={<Tos />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Container>
        <MainFooter /> 
      </div>
    </MantineProvider>
  );
}

export default App;
