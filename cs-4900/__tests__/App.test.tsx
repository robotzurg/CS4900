import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "../src/App";

describe("Waveform App", () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("fetches and displays API version", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      text: () => Promise.resolve("API v1.0"),
    });

    render(<App />);
    
    const button = screen.getByText(/Get API Version/i);
    fireEvent.click(button);

    await waitFor(() => expect(screen.getByText("API v1.0")).toBeInTheDocument());
  });

  test("prevents empty comment submission", async () => {
    render(<App />);
    
    const submitButton = screen.getByText(/Submit/i);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(fetch).not.toHaveBeenCalled(); // Ensure fetch is not called
      expect(screen.queryByText(/Error submitting comment/i)).not.toBeInTheDocument();
    });
  });

  test("submits a comment successfully", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: () => Promise.resolve({ id: 2, comment: "Test comment" }),
    });

    render(<App />);
    
    const input = screen.getByPlaceholderText(/Write a comment/i);
    const submitButton = screen.getByText(/Submit/i);

    fireEvent.change(input, { target: { value: "Test comment" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Test comment")).toBeInTheDocument();
    });
  });

  test("loads comments on initial render", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: () => Promise.resolve([{ id: 1, comment: "Existing Comment" }]),
    });

    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText("Existing Comment")).toBeInTheDocument();
    });
  });

  test("displays error message when fetch fails", async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error("Failed to fetch"));

    render(<App />);
    
    const button = screen.getByText(/Get API Version/i);
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Error fetching data/i)).toBeInTheDocument();
    });
  });
});