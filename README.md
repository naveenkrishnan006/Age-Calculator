# Age Calculator 🚀 MERN Stack

[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)


A full-stack Age Calculator single-page application built with the MERN stack featuring a dark cosmic/space theme.

## Features

- Calculate precise age breakdown: years, months, days
- Real-time animated circular progress indicators for hours, minutes, and seconds
- Stats grid: total days, weeks, hours, minutes, seconds, and days until next birthday
- Save calculation history to MongoDB
- View last 10 calculations from history
- Responsive glassmorphism UI with animated star field

## Tech Stack

- **Frontend:** React 18 + Vite + Axios
- **Backend:** Node.js + Express + CORS + dotenv
- **Database:** MongoDB + Mongoose

## Project Structure

```
/
├── client/          # React frontend (Vite)
│   ├── src/
│   │   ├── App.jsx
│   │   ├── AgeCalculator.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/          # Express backend
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   └── calculate.js
│   ├── server.js
│   ├── .env
│   └── package.json
├── package.json     # Root with concurrent dev scripts
└── README.md
```

## Setup Instructions

### 1. Install Dependencies

Run the following command from the root directory to install all dependencies:

```bash
npm run install-all
```

Or manually:

```bash
npm install
cd server && npm install
cd ../client && npm install
```

### 2. Configure MongoDB Connection

1. Copy `server/.env.example` to `server/.env`
2. Get free MongoDB Atlas account at [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas)
3. Create cluster, get connection string, update `MONGO_URI` in `.env`
4. Example:

```env
PORT=5000
MONGO_URI=mongodb+srv://yourusername:yourpassword@cluster0.xxxxx.mongodb.net/agecalculator?retryWrites=true&w=majority&appName=AgeCalculator
```


### 3. Run the Application

From the root directory, run both client and server concurrently:

```bash
npm run dev
```

- Frontend will run at: `http://localhost:5173`
- Backend API will run at: `http://localhost:5000`

### 4. API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/calculate` | Save user & DOB, return age data |
| GET | `/api/history` | Fetch last 10 entries |

### 5. Build for Production

```bash
cd client && npm run build
```

## Environment Requirements

- Node.js v18+
- MongoDB (local or Atlas)

## License

MIT

