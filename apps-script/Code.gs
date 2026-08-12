const SPREADSHEET_ID = '1x3Ep8opOAhnlKn2cXe0DTpbQX6IP0KiqteB43ceTnU8';
const SHEET_NAME = 'Sheet1';
const UPLOAD_FOLDER_NAME = 'Anh kiem ke PC Laptop';

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000);
    const data = JSON.parse(e.postData.contents || '{}');
    validate_(data);
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
    if (!sheet) throw new Error('Không tìm thấy sheet ' + SHEET_NAME);
    const row = Math.max(sheet.getLastRow() + 1, 4);
    const photoUrl = data.photoBase64 ? savePhoto_(data) : '';
    const values = [[
      row - 3, clean_(data.fullName), clean_(data.employeeId), clean_(data.department),
      clean_(data.position), clean_(data.jobTitle), clean_(data.purpose),
      clean_(data.manufacturer), clean_(data.manufactureYear), clean_(data.serialNumber),
      clean_(data.ipAddress), clean_(data.macAddress), clean_(data.cpu), clean_(data.storage),
      clean_(data.ram), clean_(data.graphics), clean_(data.notes), photoUrl, new Date()
    ]];
    sheet.getRange(row, 1, 1, values[0].length).setValues(values);
    return json_({ ok: true, row: row });
  } catch (error) {
    return json_({ ok: false, error: String(error.message || error) });
  } finally {
    lock.releaseLock();
  }
}

function validate_(d) {
  ['fullName','employeeId','department','purpose','manufacturer','serialNumber','cpu','storage','ram']
    .forEach(k => { if (!String(d[k] || '').trim()) throw new Error('Thiếu trường bắt buộc: ' + k); });
  if (d.photoBase64 && Utilities.base64Decode(d.photoBase64).length > 5 * 1024 * 1024) throw new Error('Ảnh vượt quá 5 MB');
}

function savePhoto_(d) {
  const folders = DriveApp.getFoldersByName(UPLOAD_FOLDER_NAME);
  const folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(UPLOAD_FOLDER_NAME);
  const ext = ({'image/jpeg':'jpg','image/png':'png','image/webp':'webp'})[d.photoMimeType] || 'jpg';
  const safeId = clean_(d.employeeId).replace(/[^a-zA-Z0-9_-]/g, '_');
  const name = `${safeId}_${Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyyMMdd_HHmmss')}.${ext}`;
  const blob = Utilities.newBlob(Utilities.base64Decode(d.photoBase64), d.photoMimeType || 'image/jpeg', name);
  return folder.createFile(blob).getUrl();
}

function clean_(value) {
  const text = String(value == null ? '' : value).trim();
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function json_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}
