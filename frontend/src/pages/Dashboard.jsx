import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, ShieldAlert, Archive, TrendingUp, MapPin } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    blacklisted: 0,
    active: 0,
    archived: 0,
    cityBreakdown: []
  });
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    fetchStats();
    setGreetingMessage();
  }, []);

  const setGreetingMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Good Morning');
    } else if (hour < 18) {
      setGreeting('Good Afternoon');
    } else {
      setGreeting('Good Evening');
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Applicants',
      value: stats.total,
      icon: Users,
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    },
    {
      title: 'Active Accounts',
      value: stats.active,
      icon: TrendingUp,
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      title: 'Blacklisted',
      value: stats.blacklisted,
      icon: ShieldAlert,
      color: 'text-danger',
      bgColor: 'bg-danger/10'
    },
    {
      title: 'Archived',
      value: stats.archived,
      icon: Archive,
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Greeting Header */}
      <div className="bg-gradient-to-r from-accent/20 to-accent/5 rounded-xl p-6 border border-accent/30">
        <div className="flex items-center gap-4">
          <img 
            src="/pictures/DHSUD_Logo.png" 
            alt="DHSUD Logo" 
            className="w-16 h-16 object-contain"
          />
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-text">{greeting}, Employee!</h2>
            <p className="text-gray-300 mt-1">Welcome to DHSUD - Negros Island Region Database</p>
            <p className="text-sm text-gray-400 mt-2">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-text">Dashboard</h1>
        <p className="text-gray-400 mt-1">Overview of applicant database</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-card rounded-xl p-6 border border-border hover:border-accent/50 transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">{stat.title}</p>
                <p className="text-3xl font-bold text-text mt-2">
                  {loading ? '...' : stat.value}
                </p>
              </div>
              <div className={`${stat.bgColor} ${stat.color} p-3 rounded-lg`}>
                <stat.icon size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Info */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="text-accent" size={24} />
          <h2 className="text-xl font-bold text-text">Quick Stats</h2>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Active Accounts</span>
            <span className="font-semibold text-text">
              {stats.active}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Blacklist Rate</span>
            <span className="font-semibold text-text">
              {stats.total > 0 
                ? ((stats.blacklisted / stats.total) * 100).toFixed(1) 
                : 0}%
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Database Status</span>
            <span className="text-success font-semibold">● Online</span>
          </div>
        </div>
      </div>

      {/* City Breakdown */}
      {stats.cityBreakdown && stats.cityBreakdown.length > 0 && (
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="text-accent" size={24} />
            <h2 className="text-xl font-bold text-text">City/Municipality Breakdown</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
            {stats.cityBreakdown.map((city, index) => (
              <div key={index} className="bg-background rounded-lg p-4 border border-border">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">{city.city}</span>
                  <span className="font-bold text-accent text-lg">{city.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
