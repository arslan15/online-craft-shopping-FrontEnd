import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export function ContactAnalyticsEmbedded() {
  const [chartData, setChartData] = useState([]);
  const [recentMessages, setRecentMessages] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token') || localStorage.getItem('accessToken');

    axios.get(`${process.env.REACT_APP_API_BASE_URL}/admin/messages`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        const rawData = response.data;
        const messages = Array.isArray(rawData) 
          ? rawData 
          : (rawData.messages || rawData.data || rawData.items || []);
        
        const getDateString = (createdAtField) => {
          if (!createdAtField) return null;
          if (typeof createdAtField === 'object' && createdAtField.$date) {
            return createdAtField.$date;
          }
          return createdAtField;
        };

        // 1. Group for Recharts using 'createdAt'
        const dateMap = {};
        messages.forEach(msg => {
          const dateStr = getDateString(msg.createdAt);
          if (dateStr) {
            const dateOnly = dateStr.split('T')[0];
            dateMap[dateOnly] = (dateMap[dateOnly] || 0) + 1;
          }
        });

        const formattedData = Object.keys(dateMap)
          .sort()
          .map(date => ({
            date: date,
            messagesReceived: dateMap[date]
          }));

        setChartData(formattedData);
        
        // 2. Grab latest 4 messages for the recent feed
        const sortedByDate = [...messages].sort((a, b) => {
          const dateA = new Date(getDateString(a.createdAt) || 0);
          const dateB = new Date(getDateString(b.createdAt) || 0);
          return dateB - dateA;
        });
        
        setRecentMessages(sortedByDate.slice(0, 4));
      })
      .catch(error => {
        console.error('Error loading contact analytics data:', error);
      });
  }, []);

  return (
    <div style={{ marginTop: '20px', marginBottom: '30px', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px', alignItems: 'start' }}>
      
      {/* Chart View (Using an amber/yellow accent color for messages) */}
      <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '12px', color: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
        <h4 style={{ marginBottom: '15px', fontSize: '1.1rem' }}>Contact Messages Trend (By Date)</h4>
        <div style={{ width: '100%', height: 260 }}>
          <ResponsiveContainer>
            <BarChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" allowDecimals={false} fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} />
              <Bar dataKey="messagesReceived" fill="#fbbf24" radius={[4, 4, 0, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Messages Feed View */}
      <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '12px', color: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
        <h4 style={{ marginBottom: '15px', fontSize: '1.1rem' }}>Recent Messages</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {recentMessages.length > 0 ? (
            recentMessages.map((msg) => (
              <div key={msg._id} style={{ backgroundColor: '#0f172a', padding: '10px 14px', borderRadius: '8px', borderLeft: '4px solid #fbbf24' }}>
                <div style={{ fontWeight: '600', fontSize: '0.9rem', marginBottom: '4px' }}>{msg.name || msg.senderName}</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: '1.3' }}>
                  {msg.message || msg.content}
                </div>
                <div style={{ fontSize: '0.65rem', color: '#fbbf24', marginTop: '6px' }}>
                  Received: {msg.createdAt ? (msg.createdAt.$date || msg.createdAt).split('T')[0] : 'N/A'}
                </div>
              </div>
            ))
          ) : (
            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>No recent messages</div>
          )}
        </div>
      </div>

    </div>
  );
}