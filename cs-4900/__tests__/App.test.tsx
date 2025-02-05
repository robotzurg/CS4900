import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import App from "../src/App";

it("fetches and displays API version", async () => {
  // Mock the fetch API to return a specific response
  vi.spyOn(global, "fetch").mockResolvedValueOnce({
    text: () => Promise.resolve("API v1.0"),
  } as Response);

  // Render the App component
  render(<App />);
  
  // Find the "Get API Version" button and click it
  const button = screen.getByText(/Get API Version/i);
  fireEvent.click(button);

  // Wait for the API version to be displayed and assert it
  await waitFor(() => expect(screen.getByText("API v1.0")).toBeInTheDocument());
});

it("loads comments on initial render", async () => {
  // Mock the fetch API to return a list of comments
  vi.spyOn(global, "fetch").mockResolvedValueOnce({
    json: () => Promise.resolve([{ id: 1, comment: "Existing Comment" }]),
  } as Response);

  // Render the App component
  render(<App />);

  // Wait for the comments to be displayed and assert their presence
  await waitFor(() => {
    expect(screen.getByText("Existing Comment")).toBeInTheDocument();
  });
});