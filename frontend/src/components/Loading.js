import React from 'react';

const Loading = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="spinner mb-4"></div>
      <p className="text-xl text-gray-600 font-semibold">{message}</p>
    </div>
  );
};

export default Loading;
