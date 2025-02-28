import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home.tsx";
import Song from "./pages/Song/Song.tsx";
import CreateReview from "./pages/CreateReview/CreateReview.tsx";
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';

function App() {
  return (
  <MantineProvider>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/song/:slug" element={<Song/>} />
      <Route path="/create-review" element={<CreateReview/>} />
    </Routes>
  </MantineProvider>
    
  );
}

export default App;