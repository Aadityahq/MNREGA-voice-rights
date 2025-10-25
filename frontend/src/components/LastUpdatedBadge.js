import React from 'react';

const LastUpdatedBadge = ({ timestamp }) => {
  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full">
      <span className="text-xl">🕐</span>
      <span className="text-sm font-semibold">
        Last Updated: {formatDate(timestamp)}
      </span>
    </div>
  );
};

export default LastUpdatedBadge;