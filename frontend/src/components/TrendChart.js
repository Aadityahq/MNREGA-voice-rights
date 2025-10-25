import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const TrendChart = ({ data, title }) => {
  const chartData = data.map(item => ({
    month: item.month,
    'Jobs Generated': item.jobsGenerated,
    'Wages (₹ Lakhs)': Math.round(item.wagesPaid / 100000),
    'Workdays': item.workdays
  }));

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl">
      <div className="flex items-center space-x-3 mb-6">
        <span className="text-4xl">📈</span>
        <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
      </div>
      
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#fff',
              border: '2px solid #3b82f6',
              borderRadius: '12px',
              padding: '12px'
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="Jobs Generated" 
            stroke="#10b981" 
            strokeWidth={3}
            dot={{ r: 6 }}
          />
          <Line 
            type="monotone" 
            dataKey="Wages (₹ Lakhs)" 
            stroke="#f59e0b" 
            strokeWidth={3}
            dot={{ r: 6 }}
          />
          <Line 
            type="monotone" 
            dataKey="Workdays" 
            stroke="#3b82f6" 
            strokeWidth={3}
            dot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendChart;