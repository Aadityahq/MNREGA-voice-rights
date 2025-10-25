# MGNREGA Voice Rights Platform

## Overview
The MGNREGA Voice Rights Platform is a visual analytics application designed to provide accessible information about MGNREGA (Mahatma Gandhi National Rural Employment Guarantee Act) data for low-literacy users. The platform allows users to explore employment data, wages, and trends in their respective districts through an intuitive interface.

## Features
- **District Selection**: Users can select their state and district to view relevant data.
- **Real-time Data**: The application fetches live data from the backend API.
- **Audio Summaries**: Users can listen to audio summaries of the data for better understanding.
- **Responsive Design**: The application is designed to be mobile-friendly and accessible.

## Project Structure
```
mgnrega-voice-rights-frontend
├── public
│   └── index.html          # Main HTML document
├── src
│   ├── index.js           # Entry point of the application
│   ├── App.js             # Main application component with routing
│   ├── styles
│   │   └── index.css      # Global styles and Tailwind CSS directives
│   ├── api
│   │   └── districtApi.js  # API calls related to districts
│   ├── utils
│   │   └── offlineCache.js  # Local storage caching functions
│   ├── components
│   │   ├── DistrictSelector.js  # Component for selecting districts
│   │   ├── DashboardCard.js      # Metric card component
│   │   ├── TrendChart.js         # Component for visualizing trends
│   │   ├── AudioSummary.js       # Component for audio summaries
│   │   └── LastUpdatedBadge.js   # Component for displaying last updated timestamp
│   └── pages
│       ├── Home.js               # Landing page component
│       └── Dashboard.js           # Dashboard component for detailed metrics
├── package.json                  # Project dependencies and scripts
├── .env.example                  # Example environment variable configuration
├── tailwind.config.js            # Tailwind CSS configuration
├── postcss.config.js             # PostCSS configuration
└── README.md                     # Project documentation
```

## Setup Instructions
1. Clone the repository:
   ```
   git clone <repository-url>
   cd mgnrega-voice-rights-frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file from the example:
   ```
   cp .env.example .env
   ```

4. Start the development server:
   ```
   npm start
   ```

## Usage
- Navigate to the home page to select your state and district.
- View various metrics and trends related to MGNREGA data.
- Use the audio summary feature to listen to data insights.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License.