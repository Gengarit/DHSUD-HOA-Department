import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';

function NoticeOfViolation() {
  const [novRecords] = useState([
    { id: 'NOV-2026-001', hoa: 'Sunset Valley HOA', status: 'Pending Response', date: 'Jan 15' }
  ]);

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Notice of Violation (NOV)</h1>
          <p className="text-[#9CA3AF] text-sm mt-1">Track and manage violation notices issued to HOAs</p>
        </div>
        <button className="bg-[#6366F1] hover:bg-[#7C3AED] text-white py-2 px-4 rounded-lg flex items-center gap-2">
          <Plus size={18} /> Create New NOV
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-[#242B3D] border border-[#3A4A62] rounded-lg p-6">
          <h3 className="text-white font-semibold mb-4">NOV Records</h3>
          <div className="flex items-center justify-center mb-4 relative">
            <Search size={16} className="absolute left-3 text-[#6B7280]" />
            <input type="text" placeholder="Search NOV..." className="w-full bg-[#1A1F2B] border border-[#3A4A62] text-white px-3 pl-9 py-2 rounded text-sm" />
          </div>
          <div className="space-y-2">
            {novRecords.map(nov => (
              <div key={nov.id} className="p-3 bg-[#1A1F2B] border border-[#3A4A62] rounded-lg cursor-pointer hover:border-[#6366F1]">
                <div className="font-medium text-[#6366F1]">{nov.id}</div>
                <div className="text-[11px] text-[#6B7280]">{nov.hoa}</div>
                <span className="text-[10px] px-2 py-1 bg-yellow-900/30 text-yellow-400 rounded inline-block mt-2">{nov.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-[#242B3D] border border-[#3A4A62] rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-6">NOV Details</h2>
          <div className="space-y-4 text-[#9CA3AF]">
            <div>
              <div className="text-[11px] text-[#6B7280]">Control Number</div>
              <div className="text-lg font-semibold text-white mt-1">NOV-2026-001</div>
            </div>
            <div>
              <div className="text-[11px] text-[#6B7280]">Violation Type</div>
              <div className="text-white mt-1">Failure to Submit Annual Reports</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NoticeOfViolation;
