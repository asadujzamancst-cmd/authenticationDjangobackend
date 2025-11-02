export async function apiRequest(endpoint: string, method: string, data?: any) {
  const res = await fetch(`http://127.0.0.1:8000/api/${endpoint}`, {
    method,
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    const message = errorData?.details || res.statusText || "Request failed";
    throw new Error(message);
  }

  return res.json();
}

// frontend/lib/api.ts
export const BASE_URL = "http://127.0.0.1:8000/api";
