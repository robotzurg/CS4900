import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home.tsx";
import Songs from "./pages/Songs/Songs.tsx";
import SongPage from "./pages/SongPage/SongPage.tsx";
import Albums from "./pages/Albums/Albums.tsx";
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import AlbumPage from "./pages/AlbumPage/AlbumPage.tsx";

function App() {
  return (
  <MantineProvider>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/songs" element={<Songs/>} />
      <Route path="/songs/:songId" element={<SongPage/>} />
      <Route path="/albums" element={<Albums/>} />
      <Route path="/albums/:albumId" element={<AlbumPage/>} />
    </Routes>
  </MantineProvider>
    
  );
}

export default App;