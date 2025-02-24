import { useState } from "react";
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const apiUrl = import.meta.env.VITE_API_DEV_URL;

  // Fetch data from the backend
  const testAPI = async () => {
    try {
      const response = await fetch(`${apiUrl}/`);
      const data = await response.text();
      setMessage(data);
    } catch (error) {
      setMessage("Error fetching API");
      console.error(error);
    }
  };

  // Fetch data from the backend
  const testAlbums = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/albums`);
      const data = await response.json();
      setMessage(data.map((a: any) => `/ ${a.title} /`));
    } catch (error) {
      setMessage("Error fetching API");
      console.error(error);
    }
  };

  return (
    <>
      <div className="header-div">
        <img className="logo" src="./src/images/new-waveform-logo.png"></img>
        <h1>Waveform</h1>
      </div>
      <div>
        <h2>Sign In</h2>
        <Button variant="secondary" className="button google" href="/login/federated/google">Sign in with Google</Button>
      </div>
      <div>
        <Button variant="primary" id="get-api-version" onClick={testAPI}>Get API Version</Button>
      </div>
      <Button variant="primary" id="get-albums" onClick={testAlbums}>Get Albums</Button>
      <p>{message}</p>
    </>
  );
}

export default App;
