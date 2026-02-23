import React, { useEffect, useState } from 'react';
import { BarChart3, AlertCircle, CheckCircle, Users } from 'lucide-react';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/dashboard/stats');
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      setStats(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError(err.message);
      // Set mock data for UI preview
      setStats({
        totalHoas: 8,
        activeHoas: 5,
        underReview: 2,
        sanctionedHoas: 1,
        totalMembers: 1495,
        totalNovs: 4,
        activeOias: 1
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-[#D1D5DB]">Loading dashboard...</div>;
  }

  return (
    <div className="p-8 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-[#9CA3AF] text-sm mt-1">Overview of scheduled events and activities</p>
      </div>

      {/* Stats Grid - Bento Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total HOAs */}
        <div className="bg-[#242B3D] border border-[#3A4A62] rounded-lg p-6 hover:border-[#6366F1] transition">
          <div className="text-[#9CA3AF] text-sm font-medium mb-2">Total HOAs</div>
          <div className="text-4xl font-bold text-white">{stats?.totalHoas || 0}</div>
        </div>

        {/* Active HOAs */}
        <div className="bg-gradient-to-br from-[#242B3D] to-[#1F2937] border border-green-900/30 rounded-lg p-6 hover:border-green-700/50 transition">
          <div className="text-[#9CA3AF] text-sm font-medium mb-2 flex items-center gap-2">
            <CheckCircle size={16} className="text-green-500" />
            Active
          </div>
          <div className="text-4xl font-bold text-green-400">{stats?.activeHoas || 0}</div>
        </div>

        {/* Under Review */}
        <div className="bg-gradient-to-br from-[#242B3D] to-[#1F2937] border border-yellow-900/30 rounded-lg p-6 hover:border-yellow-700/50 transition">
          <div className="text-[#9CA3AF] text-sm font-medium mb-2 flex items-center gap-2">
            <AlertCircle size={16} className="text-yellow-500" />
            Under Review
          </div>
          <div className="text-4xl font-bold text-yellow-400">{stats?.underReview || 0}</div>
        </div>

        {/* Total Members */}
        <div className="bg-gradient-to-br from-[#242B3D] to-[#1F2937] border border-blue-900/30 rounded-lg p-6 hover:border-blue-700/50 transition">
          <div className="text-[#9CA3AF] text-sm font-medium mb-2 flex items-center gap-2">
            <Users size={16} className="text-blue-400" />
            Total Members
          </div>
          <div className="text-4xl font-bold text-blue-400">{stats?.totalMembers?.toLocaleString() || 0}</div>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Active NOVs */}
        <div className="bg-[#242B3D] border border-[#3A4A62] rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-[#9CA3AF] text-sm">Active NOVs</div>
              <div className="text-3xl font-bold text-white mt-2">{stats?.totalNovs || 0}</div>
            </div>
            <AlertCircle size={32} className="text-orange-500 opacity-30" />
          </div>
          <p className="text-xs text-[#6B7280]">Notice of Violation records</p>
        </div>

        {/* Sanctioned HOAs */}
        <div className="bg-[#242B3D] border border-red-900/30 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-[#9CA3AF] text-sm">Sanctioned HOAs</div>
              <div className="text-3xl font-bold text-red-400 mt-2">{stats?.sanctionedHoas || 0}</div>
            </div>
            <AlertCircle size={32} className="text-red-500 opacity-30" />
          </div>
          <p className="text-xs text-[#6B7280]">Order of Imposition status</p>
        </div>

        {/* Active OIAS */}
        <div className="bg-[#242B3D] border border-[#3A4A62] rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-[#9CA3AF] text-sm">Active OIAS</div>
              <div className="text-3xl font-bold text-white mt-2">{stats?.activeOias || 0}</div>
            </div>
            <BarChart3 size={32} className="text-[#6366F1] opacity-30" />
          </div>
          <p className="text-xs text-[#6B7280]">Administrative sanctions</p>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-[#242B3D] border border-[#3A4A62] rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="bg-[#6366F1] hover:bg-[#7C3AED] text-white py-3 px-4 rounded-lg font-medium transition">
            Create New HOA
          </button>
          <button className="bg-[#242B3D] hover:bg-[#3A4A62] border border-[#3A4A62] text-white py-3 px-4 rounded-lg font-medium transition">
            File NOV
          </button>
          <button className="bg-[#242B3D] hover:bg-[#3A4A62] border border-[#3A4A62] text-white py-3 px-4 rounded-lg font-medium transition">
            Issue OIAS
          </button>
          <button className="bg-[#242B3D] hover:bg-[#3A4A62] border border-[#3A4A62] text-white py-3 px-4 rounded-lg font-medium transition">
            View Reports
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
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
