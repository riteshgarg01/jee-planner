// Google Apps Script — JEE Planner API
// Deploy as Web App: Execute as "Me", Access "Anyone"

const SHEET_NAME = 'Sheet1';

function doGet(e) {
  const code = e.parameter.code;
  if (!code) return jsonResponse({ error: 'Missing code parameter' }, 400);

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === code) {
      const row = {};
      headers.forEach((h, j) => {
        try {
          // Parse JSON fields
          if (['ratings', 'calendar', 'notes', 'backlog'].includes(h)) {
            row[h] = JSON.parse(data[i][j] || '{}');
          } else {
            row[h] = data[i][j];
          }
        } catch (err) {
          row[h] = data[i][j];
        }
      });
      return jsonResponse({ success: true, plan: row });
    }
  }
  return jsonResponse({ success: false, error: 'Plan not found' }, 404);
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    if (!body.code || !body.name) return jsonResponse({ error: 'Missing required fields' }, 400);

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    const data = sheet.getDataRange().getValues();
    const now = new Date().toISOString();

    // Check if code already exists (update)
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === body.code) {
        const row = [
          body.code,
          body.name,
          body.start_date || data[i][2],
          JSON.stringify(body.ratings || {}),
          JSON.stringify(body.calendar || []),
          JSON.stringify(body.notes || {}),
          JSON.stringify(body.backlog || []),
          now
        ];
        sheet.getRange(i + 1, 1, 1, row.length).setValues([row]);
        return jsonResponse({ success: true, action: 'updated', code: body.code });
      }
    }

    // New plan — append
    const row = [
      body.code,
      body.name,
      body.start_date || now,
      JSON.stringify(body.ratings || {}),
      JSON.stringify(body.calendar || []),
      JSON.stringify(body.notes || {}),
      JSON.stringify(body.backlog || []),
      now
    ];
    sheet.appendRow(row);
    return jsonResponse({ success: true, action: 'created', code: body.code });
  } catch (err) {
    return jsonResponse({ error: err.message }, 500);
  }
}

function jsonResponse(data, code) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
