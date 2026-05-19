# Community Event Platform - Attendee Portal (Frontend User)

Ứng dụng Frontend dành riêng cho **Người tham gia (Attendee)**. Ứng dụng cung cấp các tính năng tìm kiếm sự kiện, đăng ký tham gia, theo dõi vị trí thực tế trong hàng đợi Waitlist và gửi đánh giá phản hồi.

## 🛠️ Công Nghệ Sử Dụng
- **Framework**: React.js (Bundled by **Vite**)
- **State Management**: **Zustand** (Hỗ trợ Middleware `persist` đồng bộ trạng thái đăng nhập tự động vào `localStorage`)
- **API Client**: **Axios Instance** (Thiết lập cấu hình Interceptors tự động đính kèm Bearer Token và quản lý bẫy lỗi tập trung)
- **Styling**: **Tailwind CSS** (Thiết kế giao diện Mobile-First Responsive, kế thừa trực tiếp hệ màu từ `tokens.css`)
- **Routing**: **React Router** (Kiểm soát định tuyến bằng Protected Routes chặt chẽ)

---

## 📁 Cấu Trúc Thư Mục Ứng Dụng
```text
frontend_user/
├── src/
│   ├── api/
│   │   └── api.js              # Tạo Axios Shared Instance với cấu hình Request/Response Interceptor
│   ├── components/
│   │   ├── Layout.jsx          # Giao diện nền tương thích thiết bị di dộng (Mobile-First)
│   │   └── PrivateRoute.jsx    # Component bảo vệ định tuyến, giới hạn quyền 'attendee'
│   ├── store/
│   │   └── useAuthStore.js     # Zustand lưu trữ thông tin phiên đăng nhập và token của Attendee
│   ├── styles/
│   │   └── tokens.css          # Token màu sắc xuất bản từ Design System Figma
│   ├── pages/                  # Các màn hình chức năng chính (Browse, Register, Waitlist Status, Review)
│   ├── App.jsx
│   └── main.jsx
├── tailwind.config.js          # Khai báo mapping mã màu mở rộng từ tokens.css vào Tailwind Utility
└── vite.config.js