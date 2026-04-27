# Age Calculator (MERN Stack)

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

Create a `.env` file inside the `/server` folder with your MongoDB URI:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/agecalculator
```

Or use MongoDB Atlas:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/agecalculator?retryWrites=true&w=majority
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

