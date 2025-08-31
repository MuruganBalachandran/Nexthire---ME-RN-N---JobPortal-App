# JobPortal-RN

A modern, full-stack Job Portal application for job seekers and recruiters, built with React Native (mobile client) and Node.js/Express (backend API).

---
<img width="4220" height="4124" alt="Image" src="https://github.com/user-attachments/assets/28ae7f3f-788f-4a33-9969-1d50b1c2925c" />


## 🚀 Features

### 👤 User Authentication
- Secure signup and login for both job seekers and recruiters
- Role-based navigation and access
- Profile setup and editing

### 🧑‍💼 Job Seeker Features
- Browse and search for jobs with filters (location, type, etc.)
- View detailed job descriptions
- Apply to jobs directly from the app
- Track application status (applied, interviewed, etc.)
- Receive notifications for application updates

### 🏢 Recruiter Features
- Post new job listings
- Edit and manage posted jobs
- View and manage job applications
- Update application status (shortlist, interview, reject, etc.)
- Receive notifications when jobseekers apply
- Dashboard with recruiter-specific stats

### 🔔 Notifications System
- Real-time notifications for job applications and status changes
- Mark notifications as read
- Unread badge in header

### 📱 Modern UI/UX
- Clean, responsive design
- Consistent theming and styling
- Smooth navigation and transitions

### 🛠️ Modular Codebase
- Organized into client (React Native) and server (Node.js/Express)
- Reusable components and hooks
- Context and Redux for state management
- API service layer for all network calls

---

## 🗂️ Project Structure
```
JobPortal-RN/
│
├── client/   # React Native mobile app (see client/README.md for details)
├── server/   # Node.js/Express backend API (see server/README.md for details)
├── .gitignore
├── README.md
└── ...
```

## 🛠️ Tech Stack
- **Frontend:** React Native, Redux, React Navigation, AsyncStorage
- **Backend:** Node.js, Express, MongoDB, JWT Auth
- **Other:** REST API, Context API, Modular architecture

---

## ⚡ Quick Start

### Prerequisites
- Node.js (LTS)
- npm or yarn
- React Native CLI (for mobile)
- MongoDB (local or Atlas)

### 1. Clone the repository
```sh
git clone https://github.com/YourUsername/JobPortal-RN.git
cd JobPortal-RN
```

### 2. Install dependencies
```sh
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

### 3. Configure environment variables
- Create `.env` or `config.env` files in both `client` and `server` as needed.
- See `client/README.md` and `server/README.md` for required variables and examples.

### 4. Run the app
- **Backend:**
  ```sh
  cd server
  npm run dev
  ```
- **Frontend:**
  ```sh
  cd client
  npm run android # or npm run ios
  ```

---

## 📱 Mobile App (client)
- See [`client/README.md`](client/README.md) for detailed setup, features, and troubleshooting for the React Native app.

## 🖥️ Backend API (server)
- See [`server/README.md`](server/README.md) for API endpoints, environment setup, and backend features.

---

## 🤝 Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## 📄 License
[MIT](LICENSE)
