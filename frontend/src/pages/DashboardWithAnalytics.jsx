import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, Users, AlertCircle, CheckCircle } from 'lucide-react';

const colors = ['#10b981', '#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899'];

const DashboardWithAnalytics = () => {
  const [stats, setStats] = useState(null);
  const [cityData, setCityData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [statsRes, cityRes, statusRes] = await Promise.all([
        axios.get('http://localhost:5000/api/dashboard/stats'),
        axios.get('http://localhost:5000/api/dashboard/by-city'),
        axios.get('http://localhost:5000/api/dashboard/by-status')
      ]);

      setStats(statsRes.data);
      setCityData(cityRes.data || []);
      setStatusData(statusRes.data || []);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Active</p>
              <p className="text-3xl font-bold text-text mt-2">{stats?.total_active || 0}</p>
            </div>
            <Users className="text-accent" size={32} />
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Approved</p>
              <p className="text-3xl font-bold text-success mt-2">{stats?.approved || 0}</p>
            </div>
            <CheckCircle className="text-success" size={32} />
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Pending</p>
              <p className="text-3xl font-bold text-warning mt-2">{stats?.pending || 0}</p>
            </div>
            <TrendingUp className="text-warning" size={32} />
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Blacklisted</p>
              <p className="text-3xl font-bold text-danger mt-2">{stats?.total_blacklisted || 0}</p>
            </div>
            <AlertCircle className="text-danger" size={32} />
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="bg-card rounded-xl p-6 border border-border">
          <h3 className="text-xl font-bold text-text mb-4">Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top Cities */}
        <div className="bg-card rounded-xl p-6 border border-border">
          <h3 className="text-xl font-bold text-text mb-4">Applicants by City (Top 10)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={cityData.slice(0, 10)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="city" stroke="#888" angle={-45} textAnchor="end" height={100} />
              <YAxis stroke="#888" />
              <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #444' }} />
              <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <h3 className="text-xl font-bold text-text mb-4">Summary</h3>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <p className="text-gray-400">Total Archived</p>
            <p className="text-2xl font-bold text-text mt-2">{stats?.total_archived || 0}</p>
          </div>
          <div>
            <p className="text-gray-400">Under Review</p>
            <p className="text-2xl font-bold text-text mt-2">{stats?.under_review || 0}</p>
          </div>
          <div>
            <p className="text-gray-400">Rejected</p>
            <p className="text-2xl font-bold text-text mt-2">{stats?.rejected || 0}</p>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl p-6 border border-border">
        <h3 className="text-xl font-bold text-text mb-4">Applicants by City</h3>
        {cityData.length === 0 ? (
          <p className="text-gray-400">No city data available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
            {cityData.map((city) => (
              <div key={city.city} className="bg-background rounded-lg p-4 border border-border">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">{city.city}</span>
                  <span className="font-bold text-accent text-lg">{city.count}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardWithAnalytics;
