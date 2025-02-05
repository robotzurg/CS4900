import { useState, useEffect, FormEvent } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<{ id: number; comment: string }[]>([]);
  const apiUrl = import.meta.env.VITE_API_DEV_URL;

  // Fetch data from the backend
  const testAPI = async () => {
    try {
      const response = await fetch(`${apiUrl}/api-version`);
      const data = await response.text();
      setMessage(data);
    } catch (error) {
      setMessage("Error fetching API");
      console.error(error);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      const response = await fetch(`${apiUrl}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment }),
      });
      if (response.ok) {
        const newComment = await response.json();
        setComments((prev) => [newComment, ...prev]); 
        setComment(""); 
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  // Fetch comments from the backend
  const fetchComments = async () => {
    try {
      const response = await fetch(`${apiUrl}/comments`);
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  // Load comments on initial render
  useEffect(() => {
    fetchComments();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <h1>Waveform</h1>
      <div>
        <button id="get-api-version" onClick={testAPI}>Get API Version</button>
      </div>
      <p>{message}</p>
      <h2>Database Test</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Write a comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
      <div>
        <h2>Comments:</h2>
        <ul style={{ listStyleType: 'none' }}>
          {comments.map((item) => (
            <li key={item.id}>{item.comment}</li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default App;
