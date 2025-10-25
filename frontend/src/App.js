import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

const Home = () => <h2>Home Page</h2>;
const Dashboard = () => <h2>Dashboard Page</h2>;

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <nav className="navbar">
          <h1>
            <span role="img" aria-label="voice">🗣️</span> हमारी आवाज़, हमारे अधिकार 
            <span role="img" aria-label="rights">🛡️</span> / Our Voice, Our Rights
          </h1>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
        <footer className="footer">
          <p>Made for Rural India</p>
          <p>Powered by MGNREGA API</p>
        </footer>
      </div>
    </Router>
  );
};

export default App;