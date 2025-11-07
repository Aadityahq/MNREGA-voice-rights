import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import BrowseDistricts from './pages/BrowseDistricts';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard/:districtId" element={<Dashboard />} />
        <Route path="/browse" element={<BrowseDistricts />} />
      </Routes>
    </Router>
  );
}

export default App;
