import React from 'react';
import { Settings as SettingsIcon, Database, Shield, Info } from 'lucide-react';

const Settings = () => {
  const handleExport = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/export/hoas');
      if (!response.ok) throw new Error('Export failed');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `hoas_export_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-[#9CA3AF] text-sm mt-1">System configuration and preferences</p>
      </div>

      {/* System Information */}
      <div className="bg-[#242B3D] border border-[#3A4A62] rounded-lg p-6">
     'Salvador Benedicto', 'San Enrique', 'Toboso', 'Valladolid'].includes(loc)
  );

  const orientalCities = locations.filter(loc => 
    ['Dumaguete City', 'Bais City', 'Canlaon City', 'Guihulngan City', 'Tanjay City'].includes(loc)
  );

  const orientalMunicipalities = locations.filter(loc => 
    ['Amlan', 'Ayungon', 'Bacong', 'Basay', 'Bayawan',
     'Bindoy', 'Dauin', 'Jimalalud', 'La Libertad', 'Mabinay',
     'Manjuyod', 'Pamplona', 'San Jose', 'Santa Catalina', 'Siaton',
     'Sibulan', 'Tayasan', 'Valencia', 'Vallehermoso', 'Zamboanguita'].includes(loc)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex items-center gap-4">
          <img 
            src="/pictures/DHSUD_Logo.png" 
            alt="DHSUD Logo" 
            className="w-20 h-20 object-contain"
          />
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-text">DHSUD - Negros Island Region</h1>
            <p className="text-gray-400 mt-1">Department of Human Settlements and Urban Development</p>
            <p className="text-sm text-accent mt-2">Database Management System</p>
          </div>
        </div>
      </div>

      {/* Settings Header */}
      <div className="flex items-center gap-3">
        <SettingsIcon className="text-accent" size={32} />
        <div>
          <h2 className="text-2xl font-bold text-text">Settings</h2>
          <p className="text-gray-400 mt-1">Application configuration and information</p>
        </div>
      </div>

      {/* Database Info */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex items-center gap-3 mb-4">
          <Database className="text-accent" size={24} />
          <h2 className="text-xl font-bold text-text">Database Information</h2>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-border">
            <span className="text-gray-400">Database Type</span>
            <span className="font-semibold text-text">SQLite3</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-border">
            <span className="text-gray-400">Storage Mode</span>
            <span className="font-semibold text-text">Local File-Based</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-border">
            <span className="text-gray-400">Database Location</span>
            <span className="font-semibold text-text">backend/dhsud.db</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-400">Offline Capable</span>
            <span className="font-semibold text-success">✓ Yes</span>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="text-accent" size={24} />
          <h2 className="text-xl font-bold text-text">Security Features</h2>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-border">
            <span className="text-gray-400">Blacklist Protection</span>
            <span className="font-semibold text-success">✓ Enabled</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-border">
            <span className="text-gray-400">Control Number Lock</span>
            <span className="font-semibold text-success">✓ Active</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-400">Frontend Guard</span>
            <span className="font-semibold text-success">✓ Active</span>
          </div>
        </div>
      </div>

      {/* Application Info */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex items-center gap-3 mb-4">
          <Info className="text-accent" size={24} />
          <h2 className="text-xl font-bold text-text">Application Details</h2>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-border">
            <span className="text-gray-400">Version</span>
            <span className="font-semibold text-text">1.0.0</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-border">
            <span className="text-gray-400">Frontend</span>
            <span className="font-semibold text-text">React + Tailwind CSS</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-border">
            <span className="text-gray-400">Backend</span>
            <span className="font-semibold text-text">Node.js + Express</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-border">
            <span className="text-gray-400">Organization</span>
            <span className="font-semibold text-text">DHSUD - Negros Island Region</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-400">Purpose</span>
            <span className="font-semibold text-text">Applicant Database Management</span>
          </div>
        </div>
      </div>

      {/* Support Cities */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex items-center gap-3 mb-4">
          <MapPin className="text-accent" size={24} />
          <h2 className="text-xl font-bold text-text">Supported Locations in NIR</h2>
        </div>
        
        {/* Negros Occidental */}
        <div className="mb-6">
          <h3 className="font-semibold text-text mb-3 text-lg">Negros Occidental</h3>
          <div className="mb-3">
            <p className="text-sm text-gray-400 mb-2">Cities ({occidentCities.length})</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {occidentCities.map((city) => (
                <div key={city} className="bg-background rounded-lg px-3 py-2 border border-border">
                  <span className="text-sm text-gray-300">{city}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-2">Municipalities ({occidentMunicipalities.length})</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {occidentMunicipalities.map((municipality) => (
                <div key={municipality} className="bg-background rounded-lg px-3 py-2 border border-border">
                  <span className="text-sm text-gray-300">{municipality}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Negros Oriental */}
        <div>
          <h3 className="font-semibold text-text mb-3 text-lg">Negros Oriental</h3>
          <div className="mb-3">
            <p className="text-sm text-gray-400 mb-2">Cities ({orientalCities.length})</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {orientalCities.map((city) => (
                <div key={city} className="bg-background rounded-lg px-3 py-2 border border-border">
                  <span className="text-sm text-gray-300">{city}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-2">Municipalities ({orientalMunicipalities.length})</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {orientalMunicipalities.map((municipality) => (
                <div key={municipality} className="bg-background rounded-lg px-3 py-2 border border-border">
                  <span className="text-sm text-gray-300">{municipality}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-accent/10 border border-accent/30 rounded-lg">
          <p className="text-sm text-gray-300">
            <strong className="text-accent">Total Locations:</strong> {locations.length} (Cities and Municipalities across Negros Island Region)
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
