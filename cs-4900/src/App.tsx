import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home.tsx";
import Song from "./pages/Song/Song.tsx";
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';

function App() {
  return (
  <MantineProvider>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/song/:slug" element={<Song/>} />
    </Routes>
  </MantineProvider>
    
  );
}

export default App;