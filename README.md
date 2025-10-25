# Our Voice, Our Rights - MGNREGA Analytics Platform

A comprehensive MERN stack web application that makes MGNREGA (Mahatma Gandhi National Rural Employment Guarantee Act) data accessible to rural citizens through an intuitive, low-literacy friendly interface.

## 🎯 Project Goals

- Make district-level MGNREGA performance data accessible to rural citizens with low literacy
- Fetch real-time data from the official MGNREGA API
- Display metrics in a user-friendly, visual format with icons and color coding
- Provide audio summaries for accessibility
- Support offline functionality with caching
- Show historical trends and comparisons

## 🚀 Tech Stack

### Frontend
- **React.js** - UI Framework
- **Tailwind CSS** - Styling
- **Recharts** - Data Visualization
- **Axios** - HTTP Client
- **React Router** - Navigation
- **Web Speech API** - Audio Summaries

### Backend
- **Node.js** - Runtime
- **Express.js** - Web Framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Redis** - Caching Layer
- **node-cron** - Background Jobs
- **Axios** - External API Calls

### External APIs
- MGNREGA Official API from data.gov.in

## 📁 Project Structure

```
MNREGA-voice-rights/
├── backend/
│   ├── server.js
│   ├── routes/
│   │   └── district.js
│   ├── controllers/
│   │   └── districtController.js
│   ├── models/
│   │   └── District.js
│   ├── utils/
│   │   └── fetchMGNREGA.js
│   ├── worker/
│   │   └── cronWorker.js
│   ├── config/
│   │   ├── db.js
│   │   └── redis.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js
│   │   ├── index.js
│   │   ├── api/
│   │   │   └── districtApi.js
│   │   ├── components/
│   │   │   ├── DistrictSelector.js
│   │   │   ├── DashboardCard.js
│   │   │   ├── TrendChart.js
│   │   │   ├── AudioSummary.js
│   │   │   └── LastUpdatedBadge.js
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   └── Dashboard.js
│   │   ├── utils/
│   │   │   └── offlineCache.js
│   │   └── styles/
│   │       └── index.css
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
└── README.md
```

## ✨ Features

- 📊 **Real-time MGNREGA Data** - Fetch latest data from official API
- 🗺️ **District-level Insights** - Performance metrics by district
- 📈 **Historical Trends** - View data over 6-12 months
- 🔊 **Audio Summaries** - Text-to-speech for accessibility
- 📱 **Mobile Responsive** - Works on all devices
- 💾 **Offline Support** - Cached data when API is unavailable
- 🎨 **Color-coded Indicators** - Visual performance feedback
- 🌐 **Geolocation** - Auto-detect user's district

## 🔧 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18+ and npm
- **MongoDB** 6+
- **Redis** 7+
- **MGNREGA API Key** from data.gov.in

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Aadityahq/MNREGA-voice-rights.git
cd MNREGA-voice-rights
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` file with your configuration:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mgnrega
REDIS_HOST=localhost
REDIS_PORT=6379
MGNREGA_API_URL=https://api.data.gov.in/resource/
MGNREGA_API_KEY=579b464db66ec23bdd0000014163ff6e731d472341108be0a8cc8eba
NODE_ENV=development
```

Start the backend server:

```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
```

Edit `.env` file:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm start
```

### 4. Run Background Worker (Optional)

```bash
cd backend
npm run worker
```

The application will be available at `http://localhost:3000`

## 📡 API Endpoints

### GET /api/states
Returns list of all states

**Response:**
```json
{
  "success": true,
  "data": [
    { "id": 1, "name": "Uttar Pradesh" },
    { "id": 2, "name": "Bihar" }
  ]
}
```

### GET /api/districts/:id
Returns district metrics and trends

**Response:**
```json
{
  "success": true,
  "data": {
    "districtId": 123,
    "name": "Allahabad",
    "state": "Uttar Pradesh",
    "monthlyMetrics": [
      {
        "month": "2025-10",
        "jobsGenerated": 15000,
        "wagesPaid": 25000000,
        "workdays": 45000
      }
    ],
    "lastUpdated": "2025-10-25T20:55:31Z"
  }
}
```

### GET /api/districts/:id/audio-summary
Returns text summary for audio playback

**Response:**
```json
{
  "success": true,
  "summary": "In Allahabad district, 15,000 jobs were generated this month..."
}
```

## 🎨 UI Components

### Color Coding
- 🟢 **Green** - Good performance (>80% of target)
- 🟡 **Yellow** - Moderate performance (50-80%)
- 🔴 **Red** - Poor performance (<50%)

### Icons
- 💼 Jobs Generated
- 💰 Wages Paid
- 📅 Total Workdays
- 👥 Employment Provided
- 📍 Location/District
- 🔊 Audio Summary

## 🌐 Deployment

### VPS/VM Deployment

1. **Install dependencies on server:**
```bash
# Install Node.js, MongoDB, Redis
sudo apt update
sudo apt install nodejs npm mongodb redis-server
```

2. **Clone and setup:**
```bash
git clone https://github.com/Aadityahq/MNREGA-voice-rights.git
cd MNREGA-voice-rights
```

3. **Backend deployment:**
```bash
cd backend
npm install --production
npm install -g pm2
pm2 start server.js --name mgnrega-api
pm2 start worker/cronWorker.js --name mgnrega-worker
pm2 save
pm2 startup
```

4. **Frontend deployment:**
```bash
cd frontend
npm install
npm run build
```

5. **Nginx configuration:**
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        root /path/to/frontend/build;
        try_files $uri /index.html;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
# Check MongoDB status
sudo systemctl status mongodb

# Restart MongoDB
sudo systemctl restart mongodb
```

### Redis Connection Issues
```bash
# Check Redis status
sudo systemctl status redis

# Test Redis connection
redis-cli ping
```

### API Rate Limits
The MGNREGA API has rate limits. The application uses caching to minimize API calls.

### Offline Mode Not Working
Check browser localStorage permissions and ensure Service Worker is properly registered.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👥 Authors

- **Aadityahq** - Initial work

## 🙏 Acknowledgments

- MGNREGA Official API from data.gov.in
- Rural citizens of India
- Open source community

---

**Made with ❤️ for rural India**