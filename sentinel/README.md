# Sentinel - Cybersecurity Platform

A comprehensive MERN stack cybersecurity platform for small and medium enterprises.

## Features

- **AI/ML Threat Detection** - URL, Email, and Fraud scanning
- **Gamified Learning** - Interactive missions, ranking system (Bronze to Diamond)
- **YouTube Integration** - Educational videos with point rewards
- **Advanced Security Tools** - Honeypot simulation, deepfake detection, privacy analyzer
- **Report System** - Forward threats to cybercrime/police/HR departments
- **Offline Scanner** - Local file scanning and report export
- **Auto-Heal Mode** - Automatic threat response and mitigation

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### 1. Backend Setup

```bash
cd sentinel/server
npm install
```

Create a `.env` file in the server directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/sentinel
NODE_ENV=development
```

For MongoDB Atlas, use:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/sentinel
```

Start the server:
```bash
npm run dev
```

### 2. Frontend Setup

```bash
cd sentinel/client
npm install
```

Create a `.env` file in the client directory:
```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:
```bash
npm run dev
```

### 3. MongoDB Setup

#### Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. The app will connect to `mongodb://localhost:27017/sentinel`

#### MongoDB Atlas (Cloud)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Update the `MONGO_URI` in your `.env` file

### 4. Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/api/health

## API Endpoints

### Core Security
- `POST /api/scan/url` - Scan URLs for threats
- `POST /api/scan/email` - Scan emails for phishing
- `POST /api/scan/fraud` - Detect fraudulent transactions

### Reports & Activity
- `GET /api/activity` - Get security activity log
- `POST /api/activity` - Log security events
- `GET /api/reports` - Get threat reports
- `POST /api/report/:target` - Submit threat report

### Learning & Gamification
- `GET /api/missions` - Get cyber missions
- `GET /api/learning/videos` - Get educational videos
- `GET /api/games` - Get security games
- `GET /api/user/rank` - Get user ranking

### Advanced Tools
- `POST /api/honeypot/simulate` - Simulate honeypot
- `POST /api/deepfake/detect` - Detect deepfake content
- `POST /api/security/boost` - One-click security boost
- `POST /api/scanner/offline` - Scan local files

## Database Models

- **User** - User accounts with ranking and progress
- **Activity** - Security events and logs
- **Report** - Threat reports to authorities
- **Mission** - Gamified learning missions

## Troubleshooting

### MongoDB Connection Issues
1. Ensure MongoDB is running locally or Atlas cluster is accessible
2. Check the `MONGO_URI` in your `.env` file
3. Verify network connectivity and firewall settings

### Port Conflicts
- Backend runs on port 5000 by default
- Frontend runs on port 5173 by default
- Change ports in respective `.env` files if needed

### CORS Issues
- The backend is configured to allow all origins in development
- For production, update CORS settings in `server/index.js`

## Development

The application uses:
- **Backend**: Express.js, MongoDB, Mongoose
- **Frontend**: React, Vite, Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Hooks

## License

MIT License - see LICENSE file for details