const SHEET_NAME = "Links";
const HEADERS = ["id", "title", "url", "category", "description", "createdAt"];

function doGet() {
  return jsonResponse({ ok: true, links: getLinks() });
}

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents || "{}");

    if (payload.action === "list") {
      return jsonResponse({ ok: true, links: getLinks() });
    }

    if (payload.action === "create") {
      const link = sanitizeLink(payload.link);
      getSheet().appendRow([
        link.id,
        link.title,
        link.url,
        link.category,
        link.description,
        link.createdAt,
      ]);
      return jsonResponse({ ok: true, link });
    }

    if (payload.action === "delete") {
      deleteLink(String(payload.id || ""));
      return jsonResponse({ ok: true });
    }

    return jsonResponse({ ok: false, error: "Unsupported action" });
  } catch (error) {
    return jsonResponse({ ok: false, error: error.message });
  }
}

function getLinks() {
  const sheet = getSheet();
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];

  return sheet
    .getRange(2, 1, lastRow - 1, HEADERS.length)
    .getValues()
    .filter((row) => row[0])
    .map((row) => ({
      id: String(row[0]),
      title: String(row[1] || ""),
      url: String(row[2] || ""),
      category: String(row[3] || ""),
      description: String(row[4] || ""),
      createdAt: row[5] instanceof Date ? row[5].toISOString() : String(row[5] || ""),
    }))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function deleteLink(id) {
  if (!id) throw new Error("Missing id");

  const sheet = getSheet();
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return;

  const ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  const index = ids.findIndex((row) => String(row[0]) === id);
  if (index >= 0) sheet.deleteRow(index + 2);
}

function sanitizeLink(link) {
  if (!link) throw new Error("Missing link");

  const clean = {
    id: String(link.id || Utilities.getUuid()),
    title: String(link.title || "").trim(),
    url: String(link.url || "").trim(),
    category: String(link.category || "ทั่วไป").trim(),
    description: String(link.description || "").trim(),
    createdAt: String(link.createdAt || new Date().toISOString()),
  };

  if (!clean.title) throw new Error("Missing title");
  if (!clean.url) throw new Error("Missing url");
  if (!clean.description) throw new Error("Missing description");

  return clean;
}

function getSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  const firstRow = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
  const hasHeaders = HEADERS.every((header, index) => firstRow[index] === header);

  if (!hasHeaders) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.setFrozenRows(1);
  }

  return sheet;
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
