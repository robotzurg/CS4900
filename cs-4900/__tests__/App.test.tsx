import { expect, it, vi } from "vitest";
import {
  createItem,
  updateItem,
  deleteItem,
  searchByName,
  uploadImage,
  getReview,
  getMusicReviews,
  updateReview,
  fetchCommentsForReview,
  updateUser,
  onSearch,
  authLogout
} from "../src/services";   

it("createItem() POSTs to /api/{entity} and returns JSON", async () => {
  const payload = { foo: "bar" };
  const spy = vi.spyOn(global, "fetch").mockResolvedValueOnce({
    ok: true,
    json: () => Promise.resolve({ id: "1", ...payload }),
  } as any);

  const result = await createItem("tests", payload);
  expect(spy).toHaveBeenCalledWith(
    expect.stringMatching(/\/api\/tests$/),
    expect.objectContaining({
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
  );
  expect(result).toMatchObject({ id: "1", ...payload });
});

it("updateItem() PUTs to /api/{entity}/{id} and returns JSON", async () => {
  const payload = { name: "updated" };
  const spy = vi.spyOn(global, "fetch").mockResolvedValueOnce({
    ok: true,
    json: () => Promise.resolve({ id: "2", ...payload }),
  } as any);

  const result = await updateItem("tests", "2", payload);
  expect(spy).toHaveBeenCalledWith(
    expect.stringMatching(/\/api\/tests\/2$/),
    expect.objectContaining({
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
  );
  expect(result).toMatchObject({ id: "2", ...payload });
});

it("deleteItem() DELETEs /api/{entity}/{id} and returns JSON", async () => {
  const spy = vi.spyOn(global, "fetch").mockResolvedValueOnce({
    ok: true,
    json: () => Promise.resolve({ success: true }),
  } as any);

  const result = await deleteItem("tests", "3");
  expect(spy).toHaveBeenCalledWith(
    expect.stringMatching(/\/api\/tests\/3$/),
    expect.objectContaining({ method: "DELETE" })
  );
  expect(result).toEqual({ success: true });
});

it("searchByName() queries /api/{entity}?query=term and maps results", async () => {
  const fake = [{ id: "g1", name: "Rock" }];
  const spy = vi.spyOn(global, "fetch").mockResolvedValueOnce({
    ok: true,
    json: () => Promise.resolve(fake),
  } as any);

  const results = await searchByName("genres", "rock");
  expect(spy).toHaveBeenCalledWith(
    expect.stringMatching(/\/api\/genres\?query=rock$/)
  );
  expect(results).toEqual(fake.map(({ id, name }) => ({ id, name })));
});

it("uploadImage() POSTs FormData to /api/upload and returns URL", async () => {
  const file = new File([""], "img.png");
  const spy = vi.spyOn(global, "fetch").mockResolvedValueOnce({
    ok: true,
    json: () => Promise.resolve({ url: "http://u" }),
  } as any);

  const result = await uploadImage(file);
  expect(spy).toHaveBeenCalledWith(
    expect.stringMatching(/\/api\/upload$/),
    expect.objectContaining({
      method: "POST",
      body: expect.any(FormData),
    })
  );
  expect(result).toEqual({ url: "http://u" });
});

it("getReview() GETs /api/reviews/{id} with credentials", async () => {
  const spy = vi.spyOn(global, "fetch").mockResolvedValueOnce({
    ok: true,
    json: () => Promise.resolve({ id: "r1", text: "hey" }),
  } as any);

  const review = await getReview("r1");
  expect(spy).toHaveBeenCalledWith(
    expect.stringMatching(/\/api\/reviews\/r1$/),
    expect.objectContaining({
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
  );
  expect(review).toEqual({ id: "r1", text: "hey" });
});

it("getMusicReviews() GETs /api/reviews/{entity}/{musicId}", async () => {
  const spy = vi.spyOn(global, "fetch").mockResolvedValueOnce({
    ok: true,
    json: () => Promise.resolve([{ id: "r2" }]),
  } as any);

  const list = await getMusicReviews("songs", "s1");
  expect(spy).toHaveBeenCalledWith(
    expect.stringMatching(/\/api\/reviews\/songs\/s1$/),
    expect.objectContaining({
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
  );
  expect(list).toEqual([{ id: "r2" }]);
});

it("updateReview() PUTs to /api/reviews/{id}", async () => {
  const data = { id: "r3", text: "upd" };
  const spy = vi.spyOn(global, "fetch").mockResolvedValueOnce({
    ok: true,
    json: () => Promise.resolve(data),
  } as any);

  const out = await updateReview(data);
  expect(spy).toHaveBeenCalledWith(
    expect.stringMatching(/\/api\/reviews\/r3$/),
    expect.objectContaining({
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    })
  );
  expect(out).toEqual(data);
});

it("fetchCommentsForReview() GETs /api/comments/review/{reviewId}", async () => {
  const spy = vi.spyOn(global, "fetch").mockResolvedValueOnce({
    ok: true,
    json: () => Promise.resolve(["c1", "c2"]),
  } as any);

  const comments = await fetchCommentsForReview("r4");
  expect(spy).toHaveBeenCalledWith(
    expect.stringMatching(/\/api\/comments\/review\/r4$/)
  );
  expect(comments).toEqual(["c1", "c2"]);
});

it("updateUser() PUTs to /api/users/{id} with credentials", async () => {
  const user = { id: "u5", bio: "new" };
  const spy = vi.spyOn(global, "fetch").mockResolvedValueOnce({
    ok: true,
    json: () => Promise.resolve(user),
  } as any);

  const out = await updateUser(user);
  expect(spy).toHaveBeenCalledWith(
    expect.stringMatching(/\/api\/users\/u5$/),
    expect.objectContaining({
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(user),
    })
  );
  expect(out).toEqual(user);
});

it("onSearch() GETs /api/search(/type)?q=term and returns JSON", async () => {
  const spy = vi.spyOn(global, "fetch").mockResolvedValueOnce({
    ok: true,
    json: () => Promise.resolve([{ id: "s1" }]),
  } as any);

  const out1 = await onSearch("foo");
  expect(spy).toHaveBeenCalledWith(
    expect.stringMatching(/\/api\/search\?q=foo$/)
  );
  expect(out1).toEqual([{ id: "s1" }]);

  await onSearch("bar", "songs");
  expect(spy).toHaveBeenCalledWith(
    expect.stringMatching(/\/api\/search\/songs\?q=bar$/)
  );
});

it("authLogout() calls /logout with credentials and does not throw", async () => {
  const spy = vi.spyOn(global, "fetch").mockResolvedValueOnce({
    ok: true,
  } as any);

  await expect(authLogout()).resolves.toBeUndefined();
  expect(spy).toHaveBeenCalledWith(
    expect.stringMatching(/\/logout$/),
    expect.objectContaining({ credentials: "include" })
  );
});
