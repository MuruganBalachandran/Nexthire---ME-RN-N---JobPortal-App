@echo off
echo Installing Job Portal Server Dependencies...
npm install
echo.
echo Dependencies installed successfully!
echo.
echo Next steps:
echo 1. Configure config.env file with your MongoDB URI and JWT secret
echo 2. Start MongoDB
echo 3. Run: npm run dev
pause
