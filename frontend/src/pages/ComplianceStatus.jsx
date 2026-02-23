import React from 'react';

function ComplianceStatus() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Compliance Status</h1>
        <p className="text-[#9CA3AF] text-sm mt-1">Track HOA standing and compliance issues</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Suspended', count: 2, icon: '⏸' },
          { label: 'No Legal Standing', count: 1, icon: '✕' },
          { label: 'Dissolved', count: 1, icon: '○' },
          { label: 'Revoked', count: 2, icon: '⛔' },
          { label: 'Term Expired', count: 1, icon: '⏱' }
        ].map((stat) => (
          <div key={stat.label} className="bg-[#242B3D] border border-[#3A4A62] rounded-lg p-4 text-center hover:border-[#6366F1] transition">
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className="text-2xl font-bold text-white">{stat.count}</div>
            <div className="text-[11px] text-[#9CA3AF] mt-2">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-[#242B3D] border border-[#3A4A62] rounded-lg p-6">
        <div className="mb-6">
          <h3 className="text-white font-semibold mb-3">Filter by Status</h3>
          <div className="flex gap-2 flex-wrap">
            {['All (7)', 'Suspended (2)', 'No Legal Standing (1)', 'Dissolved (1)', 'Revoked (2)', 'Term Expired (1)'].map((filter) => (
              <button key={filter} className="px-3 py-1 bg-[#3A4A62] text-[#9CA3AF] rounded text-[11px] hover:bg-[#6366F1] hover:text-white transition">
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="bg-yellow-900/10 border border-yellow-900/20 p-4 rounded-lg">
            <div className="font-semibold text-white">River Park Homeowners</div>
            <div className="text-[11px] text-[#6B7280] mt-1">HOA-2023-067</div>
            <div className="mt-3 text-[11px]">
              <span className="px-3 py-1 bg-red-900/30 text-red-400 rounded-full font-semibold">SANCTIONED</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ComplianceStatus;
