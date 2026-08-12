# Kiểm kê PC/Laptop

Web form tĩnh cho GitHub Pages, ghi một thiết bị trên mỗi dòng vào Google Sheet và hỗ trợ tải ảnh lên Google Drive qua Google Apps Script.

## Triển khai backend Google Apps Script

1. Mở https://script.google.com và tạo **New project**.
2. Dán nội dung `apps-script/Code.gs` vào file `Code.gs`.
3. Chọn **Deploy → New deployment → Web app**.
4. Execute as: **Me**. Who has access: **Anyone**.
5. Deploy, cấp quyền Google Drive/Sheets và sao chép URL kết thúc bằng `/exec`.
6. Trong `docs/index.html`, thay `APPS_SCRIPT_WEB_APP_URL` bằng URL `/exec` đó.

## GitHub Pages

Trong repository Settings → Pages, chọn **Deploy from a branch**, branch `main`, thư mục `/docs`.

Google Sheet cần thêm hai cột ở cuối: `Ảnh thiết bị` (R) và `Thời gian gửi` (S).
