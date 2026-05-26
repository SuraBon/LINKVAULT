import { SHEETS_API_URL } from "../constants/links";

export async function sheetsRequest(payload) {
  const response = await fetch(SHEETS_API_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload),
  });

  let data;
  try {
    data = await response.json();
  } catch (error) {
    throw new Error("ไม่สามารถประมวลผลข้อมูลจาก Google Sheets ได้ (รูปแบบการตอบกลับไม่ถูกต้อง)");
  }

  if (!response.ok || data.ok === false) {
    throw new Error(data.error || "Google Sheets request failed");
  }

  return data;
}
