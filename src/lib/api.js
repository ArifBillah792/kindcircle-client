const API_URL = process.env.NEXT_PUBLIC_API_URL;

// One helper for every call to the Express server
export async function apiFetch(
  path,
  { method = "GET", body, auth = false } = {},
) {
  const headers = { "Content-Type": "application/json" };

  // For protected routes, get a JWT from our own /api/token route
  if (auth) {
    const tokenRes = await fetch("/api/token");
    const tokenData = await tokenRes.json();
    if (!tokenRes.ok || !tokenData.token) {
      throw new Error("Please log in again");
    }
    headers.Authorization = `Bearer ${tokenData.token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const result = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(result.message || "Something went wrong");
  }

  return result;
}
