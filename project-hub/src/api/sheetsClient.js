import { SHEETS_API_URL } from "../constants/links";

export async function sheetsRequest(payload) {
  const response = await fetch(SHEETS_API_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload),
  });
  const data = await response.json();

  if (!response.ok || data.ok === false) {
    throw new Error(data.error || "Google Sheets request failed");
  }

  return data;
}
