# JobPortal-RN

A cross-platform Job Portal application built with React Native (frontend) and Node.js/Express (backend).

## Features
- User authentication (jobseeker & recruiter)
- Job posting and application
- Notifications system
- Profile management
- Recruiter dashboard
- Modularized codebase

## Project Structure
```
client/   # React Native app
server/   # Node.js/Express backend
```

## Setup

### Prerequisites
- Node.js (LTS)
- npm or yarn
- React Native CLI (for mobile)
- MongoDB (local or cloud)

### Install dependencies
```
cd client
npm install
cd ../server
npm install
```

### Environment Variables
- Create `.env` or `config.env` files in both `client` and `server` as needed.
- See `.env.example` or documentation for required variables.

### Running the App
- **Backend:**
  ```
  cd server
  npm run dev
  ```
- **Frontend:**
  ```
  cd client
  npm run android # or npm run ios
  ```

## Contributing
Pull requests are welcome. For major changes, please open an issue first.

## License
[MIT](LICENSE)
