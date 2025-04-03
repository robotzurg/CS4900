import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Songs from "./pages/Songs/Songs";
import SongPage from "./pages/SongPage/SongPage";
import Albums from "./pages/Albums/Albums";
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import AlbumPage from "./pages/AlbumPage/AlbumPage";
import ProfilePage from "./pages/Profile/Profile";
import SearchPage from "./pages/Search/Search";
import Artists from "./pages/Artists/Artists";
import ArtistPage from "./pages/ArtistPage/ArtistPage";
import CreateProfilePage from "./pages/CreateProfilePage/CreateProfilePage";
import MainNavbar from "./components/MainNavbar";
import MainFooter from "./components/MainFooter";
import { useEffect } from "react";
import { Container } from "react-bootstrap";

function App() {
  useEffect(() => {
    const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
    if (link) link.href = "/favicon.png";
  }, []);

  return (
    <MantineProvider>
      <div className="d-flex flex-column min-vh-100">
        <MainNavbar />
        <Container className="flex-grow-1 py-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/songs" element={<Songs />} />
            <Route path="/songs/:songId" element={<SongPage />} />
            <Route path="/albums" element={<Albums />} />
            <Route path="/albums/:albumId" element={<AlbumPage />} />
            <Route path="/artists" element={<Artists />} />
            <Route path="/artists/:artistId" element={<ArtistPage />} />
            <Route path="/profile/:userId" element={<ProfilePage />} />
            <Route path="/create-profile" element={<CreateProfilePage />} />
            <Route path="/search" element={<SearchPage />} />
          </Routes>
        </Container>
        <MainFooter />
      </div>
    </MantineProvider>
  );
}

export default App;
