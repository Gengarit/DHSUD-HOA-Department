import React from 'react';
import { Settings as SettingsIcon, Database, Shield, Info, Download } from 'lucide-react';

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
      alert('Failed to export HOAs');
    }
  };

  const locations = [
    // Negros Occidental - Cities
    'Bacolod City', 'Bago City', 'Cadiz City', 'Escalante City', 'Himamaylan City',
    'Kabankalan City', 'La Carlota City', 'Sagay City', 'San Carlos City', 'Silay City',
    'Sipalay City', 'Talisay City', 'Victorias City',
    // Negros Occidental - Municipalities
    'Arimao', 'Bauan', 'Calinog', 'Calatrava', 'Candoni', 'Cauayan', 'Enrique Villanueva',
    'Hinigaran', 'Ilog', 'Isabela', 'Jaro', 'La Castellana', 'Magsikap', 'Manapla',
    'Moises Padilla', 'Murcia', 'Pontevedra', 'Pulupandan', 'Salawag', 'Salvador Benedicto',
    'San Enrique', 'Toboso', 'Valladolid',
    // Negros Oriental - Cities
    'Dumaguete City', 'Bais City', 'Canlaon City', 'Guihulngan City', 'Tanjay City',
    // Negros Oriental - Municipalities
    'Amlan', 'Ayungon', 'Bacong', 'Basay', 'Bayawan', 'Bindoy', 'Dauin', 'Jimalalud',
    'La Libertad', 'Mabinay', 'Manjuyod', 'Pamplona', 'San Jose', 'Santa Catalina', 'Siaton',
    'Sibulan', 'Tayasan', 'Valencia', 'Vallehermoso', 'Zamboanguita'
  ];

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-[#9CA3AF] text-sm mt-1">System configuration and preferences</p>
      </div>

      {/* System Information Card */}
      <div className="bg-[#242B3D] border border-[#3A4A62] rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Info className="text-[#6366F1]" size={24} />
          <h2 className="text-xl font-bold text-white">System Information</h2>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-[#3A4A62]">
            <span className="text-[#9CA3AF]">Application Name</span>
            <span className="font-semibold text-white">DHSUD NIR HOA Management System</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-[#3A4A62]">
            <span className="text-[#9CA3AF]">Version</span>
            <span className="font-semibold text-white">1.0.0</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-[#3A4A62]">
            <span className="text-[#9CA3AF]">Release Date</span>
            <span className="font-semibold text-white">2024</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-[#9CA3AF]">Region</span>
            <span className="font-semibold text-white">Negros Island Region (NIR)</span>
          </div>
        </div>
      </div>

      {/* Database Info Card */}
      <div className="bg-[#242B3D] border border-[#3A4A62] rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Database className="text-[#6366F1]" size={24} />
          <h2 className="text-xl font-bold text-white">Database Information</h2>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-[#3A4A62]">
            <span className="text-[#9CA3AF]">Database Type</span>
            <span className="font-semibold text-white">SQLite3</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-[#3A4A62]">
            <span className="text-[#9CA3AF]">Storage Mode</span>
            <span className="font-semibold text-white">Local File-Based (Offline Capable)</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-[#3A4A62]">
            <span className="text-[#9CA3AF]">Database File</span>
            <span className="font-semibold text-white">backend/dhsud_hoa.db</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-[#9CA3AF]">Tables</span>
            <span className="font-semibold text-white">3 (hoas, legal_orders, appeals)</span>
          </div>
        </div>
      </div>

      {/* Security Features Card */}
      <div className="bg-[#242B3D] border border-[#3A4A62] rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="text-[#6366F1]" size={24} />
          <h2 className="text-xl font-bold text-white">Security Features</h2>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-2 py-2">
            <span className="text-[#10B981]">✓</span>
            <span className="text-white">SANCTION LOCK enforcement on sanctioned HOAs</span>
          </div>
          <div className="flex items-center gap-2 py-2">
            <span className="text-[#10B981]">✓</span>
            <span className="text-white">Input validation on all forms</span>
          </div>
          <div className="flex items-center gap-2 py-2">
            <span className="text-[#10B981]">✓</span>
            <span className="text-white">Referential integrity constraints</span>
          </div>
          <div className="flex items-center gap-2 py-2">
            <span className="text-[#10B981]">✓</span>
            <span className="text-white">SQL injection prevention</span>
          </div>
          <div className="flex items-center gap-2 py-2">
            <span className="text-[#10B981]">✓</span>
            <span className="text-white">XSS protection</span>
          </div>
        </div>
      </div>

      {/* Export Section */}
      <div className="bg-[#242B3D] border border-[#3A4A62] rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Download className="text-[#6366F1]" size={24} />
          <h2 className="text-xl font-bold text-white">Data Export</h2>
        </div>
        <p className="text-[#9CA3AF] mb-4">Export all HOA records to CSV format for external analysis or backup.</p>
        <button
          onClick={handleExport}
          className="bg-[#6366F1] hover:bg-[#4F46E5] text-white px-6 py-2 rounded-lg font-semibold transition"
        >
          Export HOAs to CSV
        </button>
      </div>

      {/* Supported Locations */}
      <div className="bg-[#242B3D] border border-[#3A4A62] rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">Supported Locations ({locations.length} total)</h2>
        <p className="text-[#9CA3AF] mb-4">System supports all locations across Negros Island Region</p>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-[#6366F1] font-semibold mb-3">Negros Occidental</h3>
            <ul className="space-y-1 text-sm text-[#E2E8F0]">
              <li>• 13 Cities</li>
              <li>• 20+ Municipalities</li>
            </ul>
          </div>
          <div>
            <h3 className="text-[#6366F1] font-semibold mb-3">Negros Oriental</h3>
            <ul className="space-y-1 text-sm text-[#E2E8F0]">
              <li>• 5 Cities</li>
              <li>• 15+ Municipalities</li>
            </ul>
          </div>
        </div>

        <div className="mt-4 p-4 bg-[#6366F1]/10 border border-[#6366F1]/30 rounded-lg">
          <p className="text-sm text-[#E2E8F0]">
            <strong className="text-[#6366F1]">Total Locations:</strong> {locations.length} across Negros Island Region
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
