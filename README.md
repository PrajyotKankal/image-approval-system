# 📸 Imagle

Imagle is a full-stack web application designed for secure internal image access management. It enables users to search, request, and download images after approval, while providing admins with tools to manage uploads, review requests, and oversee system analytics.

---

## 🧩 Features

### 👤 User
- Sign Up & Login (with OTP verification)
- Persistent Login using JWT
- Search images by tags
- Add to Cart
- Send image request to admin
- Download approved images (one-time zip)
- View request/download history
- Dark mode toggle
- Profile dropdown with logout

### 🛡️ Admin
- Protected admin login with credentials
- Role-based access control via JWT
- Upload images with tags
- View and edit uploaded images
- Approve or reject user requests
- Insights Dashboard: view charts, export Excel, and manage admins
- Switch back to user panel from admin view

---

## 🏗️ Tech Stack

| Layer       | Technologies Used                                           |
|------------|-------------------------------------------------------------|
| Frontend   | ReactJS, Bootstrap, Framer Motion, React Router             |
| Backend    | Node.js, Express.js                                         |
| Database   | MongoDB (Admin/User/Image metadata)                         |
| Auth       | JSON Web Token (JWT), OTP Verification                      |
| Storage    | Local folder (Image Storage), ZIP Compression               |
| Utilities  | Axios, Chart.js                                             |

---

## 🔐 Authentication & Admin Handling

### JWT Authentication
- JWT stores `{ username, role }` payload.
- Tokens are stored in `localStorage` for persistent sessions.
- Auto-role detection (Admin/User) post login.

### Admin Credentials
- Stored securely in MongoDB.
- Passwords hashed before saving.
- Admin creation only by existing logged-in admins via dashboard.

---

## 📊 Project Flow

### 🔐 User Authentication Flow
![User Authentication Flow](./assets/user-authentication.png)

### 🧠 User/Admin Dashboard Flow
![User Admin Flow](./assets/dashboard-flow.png)
---

## 💎 Why Use Imagle?

### 1. Controlled Access to Digital Assets
Only approved users can download images—preventing unauthorized access to sensitive or premium content.

### 2. Secure Role-Based System
Clear separation between user/admin functionalities using JWT, minimizing exposure.

### 3. Streamlined Request Management
Multi-image request, one-time ZIP download—optimized for user experience and admin efficiency.

### 4. Full Activity Insights
Admins can track:
- Daily request volume
- Most used tags
- User activity logs
- Admin login/logout data

### 5. Tag-Based Search
Boost discoverability of large image libraries via efficient tagging and search functionality.

### 6. Dynamic Admin Tools
Admins can:
- Upload/edit tagged images
- Manage pending requests
- Create new admin users
- Access all tools from a modern dashboard

### 7. Beautiful UI/UX
Built with Framer Motion, Bootstrap, and dark mode support—providing a responsive, polished, and professional experience.

---

## 🌍 Real-World Applications

| Sector               | Use Cases                                                                 |
|----------------------|---------------------------------------------------------------------------|
| Corporate Teams       | Share branded assets securely with internal departments.                 |
| Photography Studios   | Deliver client-specific shoot results with controlled access.            |
| Educational Institutes| Share study materials with managed access control.                       |
| Creative Agencies     | Share and approve UI drafts, illustrations, and client mockups.          |
| Government & Legal    | Manage access to media/evidence with approval tracking.                  |
| E-commerce Teams      | Centralized product image approval and download management.              |

---

## 📞 Contact
For queries, suggestions, or contributions, feel free to connect with the project creator