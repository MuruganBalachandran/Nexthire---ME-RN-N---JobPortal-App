# Job Portal Backend API

A Node.js backend API for job portal with Express, MongoDB, and JWT authentication.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `config.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/jobportal
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
```

3. Start MongoDB

4. Run the server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- POST /api/auth/register - Register user
- POST /api/auth/login - Login user
- GET /api/auth/me - Get current user

### Jobs
- GET /api/jobs - Get all jobs
- POST /api/jobs - Create job (recruiters)
- GET /api/jobs/:id - Get single job

### Applications
- POST /api/applications - Submit application
- GET /api/applications/my-applications - Get user applications

### Users
- GET /api/users/profile - Get profile
- PUT /api/users/profile - Update profile

## Features
- JWT Authentication
- Role-based access (Jobseekers/Recruiters)
- File uploads
- Job search and filtering
- Application management
- Statistics and analytics
