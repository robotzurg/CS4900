import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home.tsx";
import Songs from "./pages/Songs/Songs.tsx";
import SongPage from "./pages/SongPage/SongPage.tsx";
import Albums from "./pages/Albums/Albums.tsx";
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';

function App() {
  return (
  <MantineProvider>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/songs" element={<Songs/>} />
      <Route path="/song/:songId" element={<SongPage/>} />
      <Route path="/albums" element={<Albums/>} />
    </Routes>
  </MantineProvider>
    
  );
}

export default App;