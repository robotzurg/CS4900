import { useState, useEffect, FormEvent } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState("");
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<{ id: number; comment: string }[]>([]);

  // Fetch data from the backend
  const testAPI = async () => {
    try {
      const response = await fetch("https://cs-4900-backend.vercel.app/"); // Replace with your backend URL
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
      const response = await fetch("http://localhost:3000/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment }),
      });
      if (response.ok) {
        const newComment = await response.json();
        setComments((prev) => [newComment, ...prev]); // Add the new comment to the list
        setComment(""); // Clear the input field
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  // Fetch comments from the backend
  const fetchComments = async () => {
    try {
      const response = await fetch("http://localhost:3000/comments");
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  // Load comments on initial render
  useEffect(() => {
    fetchComments();
  }, []);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React + TypeScript</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>Edit <code>src/App.tsx</code> and save to test HMR</p>
      </div>
      <div>
        <button onClick={testAPI}>Test API</button>
      </div>
      <p>{message}</p>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
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
        <ul>
          {comments.map((item) => (
            <li key={item.id}>{item.comment}</li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default App;
