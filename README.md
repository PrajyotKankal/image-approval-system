# Imagle

Imagle is a full-stack web application designed for secure internal image access management. It enables users to search, request, and download images after approval, while providing admins with tools to manage uploads, review requests, and oversee system analytics.

---

## Features

### User
- Sign Up & Login (with OTP verification)
- Persistent Login using JWT
- Search images by tags
- Add to Cart
- Send image request to admin
- Download approved images (one-time zip)
- View request/download history
- Dark mode toggle
- Profile dropdown with logout

### Admin
- Protected admin login with credentials
- Role-based access control via JWT
- Upload images with tags
- View and edit uploaded images
- Approve or reject user requests
- Insights Dashboard: view charts, export Excel, and manage admins
- Switch back to user panel from admin view

---

## Tech Stack

| Layer       | Technologies Used                                           |
|------------|-------------------------------------------------------------|
| Frontend   | ReactJS, Bootstrap, Framer Motion, React Router             |
| Backend    | Node.js, Express.js                                         |
| Database   | MongoDB (Admin/User/Image metadata)                         |
| Auth       | JSON Web Token (JWT), OTP Verification                      |
| Storage    | Local folder (Image Storage), ZIP Compression               |
| Utilities  | Axios, Chart.js                                             |

---

## Authentication & Admin Handling

### JWT Authentication
- JWT stores `{ username, role }` payload.
- Tokens are stored in `localStorage` for persistent sessions.
- Auto-role detection (Admin/User) post login.

### Admin Credentials
- Stored securely in MongoDB.
- Passwords hashed before saving.
- Admin creation only by existing logged-in admins via dashboard.

---

## Project Flow

### User Authentication Flow
![User Authentication Flow](./assets/user-authentication.png)

### User/Admin Dashboard Flow
![User Admin Flow](./assets/dashboard-flow.png)
---

