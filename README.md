# Lò tiếng Anh

Trang ôn tiếng Anh, một file `index.html` duy nhất, không phụ thuộc thư viện ngoài, dùng được trên điện thoại.
Cùng kiểu với `../lo-luyen/`.

## Cấu trúc thư mục

```
english/
├── index.html            ← cả trang (HTML + CSS + JS), mở là chạy
├── check.js              ← kiểm tra tĩnh: node check.js
├── README.md             ← file này
├── data/
│   └── mau-nhap-nhanh.txt  ← mẫu dán vào Cài đặt → "Nhập nhanh nhiều mục"
├── sync/
│   └── supabase.sql      ← bảng + chính sách bảo mật cho đồng bộ (chạy một lần)
└── backup/               ← để file JSON xuất từ Cài đặt (tieng-anh-YYYY-MM-DD.json)
```

Cố ý giữ một file duy nhất cho trang: dễ đẩy lên GitHub Pages, không cần build.

## Menu

| Nhóm | Menu | Việc làm |
|---|---|---|
| Hôm nay | Tổng quan | thẻ đến hạn, chuỗi ngày, biểu đồ 7 ngày, các hộp ghi nhớ |
| Thư viện | Từ vựng / Mẫu câu / Ngữ pháp | thêm, sửa, xoá, tìm, lọc theo loại và chủ đề |
| Luyện | Thẻ · Trắc nghiệm · Gõ lại · Nghe chép · Từ khó | thẻ theo lịch Leitner (1-2-4-8-16-32 ngày) |
| Đọc | Bài đọc | dán bài, chạm từ lạ để lưu kèm câu chứa nó |
| Ngữ pháp | Bài ghi chú · Động từ bất quy tắc | ghi chú dài có bảng, bảng V1/V2/V3 có nghe |
| Cài đặt | | giao diện, xuất/nhập JSON, nhập nhanh, đặt lại |

## Dữ liệu

Lưu ở `localStorage` của trình duyệt (khoá `english-lab-v1`) → mỗi máy một bản riêng.
Chuyển máy: Cài đặt → Xuất JSON (lưu vào `backup/`) → gửi file → Nhập ở máy kia (mục trùng `id` bị bỏ qua).

Schema mục: `{id, type: word|phrase|grammar, en, ipa, vi, ex, tag, box 0..6, due, ok, no, at}`.
Bài đọc: `{id, title, body, at}`. Bài ngữ pháp: `{id, title, tag, body, at}`.

Cú pháp bài ngữ pháp: `# H`, `## h`, `- ý`, `**đậm**`, `> ghi chú nổi bật`, bảng `| a | b |` (dòng đầu là tiêu đề).

## Đồng bộ giữa các máy (Supabase, làm một lần)

Không bắt buộc: không đăng nhập thì trang vẫn chạy bằng dữ liệu trong trình duyệt như trước.

1. Vào supabase.com tạo project (gói miễn phí đủ dùng).
2. **SQL Editor** → dán toàn bộ `sync/supabase.sql` → Run.
3. (Tuỳ chọn, đỡ phiền) **Authentication → Providers → Email** → tắt "Confirm email" để đăng ký xong dùng được ngay.
4. **Project Settings → API**: chép *Project URL* và *anon/publishable key*.
5. Mở trang → Cài đặt → ☁ Đồng bộ → dán URL + key, nhập email/mật khẩu → **Tạo tài khoản**.
6. Trên điện thoại: cùng trang, cùng URL + key, **Đăng nhập** bằng đúng tài khoản đó.

Muốn khỏi gõ URL + key trên từng máy: điền vào hằng `CLOUD` đầu phần "Đồng bộ đám mây" trong `index.html`
(anon key vốn công khai; dữ liệu được bảo vệ bằng Row Level Security trong file SQL, **không** dán `service_role` key).

Cách hoạt động: mỗi bản ghi có dấu thời gian sửa cuối (`mt`); xoá thì để lại "bia mộ" (`dead`). Mỗi lần đồng bộ
(lúc mở trang, lúc quay lại tab, 4 giây sau mỗi thay đổi, hoặc nút "Đồng bộ ngay") là kéo bản trên mạng về, gộp
(bên nào sửa sau thì thắng), rồi đẩy lên. Token đăng nhập nằm ở khoá riêng `english-lab-sync`, không có trong file xuất JSON.

Giới hạn đã biết: hai máy sửa **cùng một mục** trong vòng vài giây thì bản sửa sau thắng (không gộp từng trường).
Muốn chuyển sang BE tự viết: thay object `REMOTE` (pull/push) và hàm `login` trong `index.html`.

## Kiểm tra trước khi đẩy

```
node check.js
```
