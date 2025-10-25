import React from 'react';

const DashboardCard = ({ icon, value, label, color, subtitle }) => {
  const colorClasses = {
    green: 'metric-card-green',
    yellow: 'metric-card-yellow',
    red: 'metric-card-red',
    blue: 'metric-card-blue',
    purple: 'metric-card-purple'
  };

  return (
    <div className={`metric-card ${colorClasses[color] || 'metric-card-blue'}`}>
      <div className="metric-icon">{icon}</div>
      <div className="metric-value">{value}</div>
      <div className="metric-label">{label}</div>
      {subtitle && (
        <div className="text-sm opacity-80 mt-2">{subtitle}</div>
      )}
    </div>
  );
};

export default DashboardCard;