import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';

export function NoticeOfViolation() {
  const [novRecords, setNovRecords] = useState([
    { id: 'NOV-2026-001', hoa: 'Sunset Valley HOA', status: 'Pending Response', date: 'Jan 15' },
    { id: 'NOV-2026-002', hoa: 'River Park Homeowners', status: 'Under Review', date: 'Jan 20' }
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
        {/* Records List */}
        <div className="lg:col-span-1 bg-[#242B3D] border border-[#3A4A62] rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Search size={18} className="text-[#6B7280]" />
            <input type="text" placeholder="Search NOV..." className="bg-[#1A1F2B] border border-[#3A4A62] text-white px-3 py-1 rounded text-sm flex-1" />
          </div>
          <div className="space-y-2">
            {novRecords.map(nov => (
              <div key={nov.id} className="p-3 bg-[#1A1F2B] border border-[#3A4A62] rounded-lg cursor-pointer hover:border-[#6366F1] transition">
                <div className="font-medium text-white">{nov.id}</div>
                <div className="text-xs text-[#6B7280]">{nov.hoa}</div>
                <div className="text-xs mt-2">
                  <span className="px-2 py-1 bg-yellow-900/30 text-yellow-400 rounded">{nov.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="lg:col-span-2 bg-[#242B3D] border border-[#3A4A62] rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">NOV Details</h2>
          <div className="space-y-4 text-[#9CA3AF]">
            <div>
              <div className="text-sm text-[#6B7280]">Control Number</div>
              <div className="text-lg font-semibold text-white mt-1">NOV-2026-001</div>
            </div>
            <div>
              <div className="text-sm text-[#6B7280]">HOA Name</div>
              <div className="text-white mt-1">Sunset Valley HOA</div>
            </div>
            <div>
              <div className="text-sm text-[#6B7280]">Violation Type</div>
              <div className="text-white mt-1">Failure to Submit Annual Reports</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function OrderOfTermination() {
  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Order of Termination (OTP)</h1>
          <p className="text-[#9CA3AF] text-sm mt-1">Manage termination orders for non-compliant HOAs</p>
        </div>
        <button className="bg-[#6366F1] hover:bg-[#7C3AED] text-white py-2 px-4 rounded-lg flex items-center gap-2">
          <Plus size={18} /> Create New OTP
        </button>
      </div>

      <div className="bg-[#242B3D] border border-[#3A4A62] rounded-lg p-6">
        <table className="w-full text-left text-[#9CA3AF] text-sm">
          <thead className="border-b border-[#3A4A62]">
            <tr>
              <th className="px-4 py-3 text-white font-semibold">Control Number</th>
              <th className="px-4 py-3 text-white font-semibold">HOA Name</th>
              <th className="px-4 py-3 text-white font-semibold">Status</th>
              <th className="px-4 py-3 text-white font-semibold">Date</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-[#3A4A62] hover:bg-[#2D3A52]">
              <td className="px-4 py-3 text-[#6366F1]">OTP-2026-001</td>
              <td className="px-4 py-3 text-white">River Park Homeowners</td>
              <td className="px-4 py-3"><span className="text-red-400">Active</span></td>
              <td className="px-4 py-3">Feb 10</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function OrderOfImposition() {
  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-white">Order of Imposition of Administrative Sanctions (OIAS)</h1>
          <p className="text-[#9CA3AF] text-sm mt-1">Track administrative sanctions imposed on HOAs</p>
        </div>
        <button className="bg-[#6366F1] hover:bg-[#7C3AED] text-white py-2 px-4 rounded-lg flex items-center gap-2">
          <Plus size={18} /> Create New OIAS
        </button>
      </div>

      <div className="space-y-4">
        <div className="bg-yellow-900/20 border border-yellow-900/40 rounded-lg p-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="font-semibold text-white">Mountain Ridge HOA</div>
              <div className="text-sm text-[#9CA3AF] mt-1">OIAS-2026-001</div>
              <div className="text-sm text-[#6B7280]">Status: Active</div>
              <div className="mt-2 text-sm">
                <span className="text-[#6B7280]">OIAS Control Number: </span>
                <span className="text-red-400 font-mono">OIAS-2026-001</span>
              </div>
              <div className="text-sm mt-1">
                <span className="text-[#6B7280]">Sanction Amount: </span>
                <span className="text-red-400 font-bold">₱50,000</span>
              </div>
            </div>
            <div className="text-right">
              <button className="bg-[#6366F1] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#7C3AED]">
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MotionForReconsideration() {
  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Motion for Reconsideration (MR)</h1>
          <p className="text-[#9CA3AF] text-sm mt-1">Appeals and reconsideration requests for OTP and OIAS orders</p>
        </div>
        <button className="bg-[#6366F1] hover:bg-[#7C3AED] text-white py-2 px-4 rounded-lg flex items-center gap-2">
          <Plus size={18} /> File New MR
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-[#242B3D] border border-[#3A4A62] rounded-lg p-4">
          <h3 className="text-white font-semibold mb-3">MR Records</h3>
          <input type="text" placeholder="Search MR..." className="w-full bg-[#1A1F2B] border border-[#3A4A62] text-white px-3 py-2 rounded-lg text-sm mb-3" />
          <div className="space-y-2">
            <div className="p-3 bg-[#1A1F2B] border border-[#3A4A62] rounded-lg cursor-pointer hover:border-[#6366F1]">
              <div className="text-[#6366F1] font-medium">MR-2026-001</div>
              <div className="text-xs text-[#6B7280]">Hillside Manor Association</div>
              <span className="text-xs px-2 py-1 bg-blue-900/30 text-blue-400 rounded mt-2 inline-block">Under Review</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-[#242B3D] border border-[#3A4A62] rounded-lg p-6">
          <h3 className="text-white font-semibold mb-4">MR Details</h3>
          <div className="space-y-4">
            <div>
              <div className="text-[#6B7280] text-sm">Control Number</div>
              <div className="text-white font-semibold text-lg mt-1">MR-2026-001</div>
            </div>
            <div>
              <div className="text-[#6B7280] text-sm">Origin Control Number</div>
              <div className="text-white mt-1">OTP-2025-015</div>
            </div>
            <div>
              <div className="text-[#6B7280] text-sm">Grounds for Reconsideration</div>
              <div className="text-white mt-1">Procedural errors in issuance of termination order</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ComplianceStatus() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Compliance Status</h1>
        <p className="text-[#9CA3AF] text-sm mt-1">Track HOA standing and compliance issues</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Suspended', count: 2, color: 'yellow' },
          { label: 'No Legal Standing', count: 1, color: 'red' },
          { label: 'Dissolved', count: 1, color: 'gray' },
          { label: 'Revoked', count: 2, color: 'red' },
          { label: 'Term Expired', count: 1, color: 'orange' }
        ].map((stat) => (
          <div key={stat.label} className={`bg-${stat.color}-900/20 border border-${stat.color}-900/40 rounded-lg p-4 text-center`}>
            <div className={`text-2xl font-bold text-${stat.color}-400`}>{stat.count}</div>
            <div className="text-xs text-[#9CA3AF] mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-[#242B3D] border border-[#3A4A62] rounded-lg p-6">
        <div className="mb-4">
          <div className="flex gap-2 flex-wrap">
            {['All (7)', 'Suspended (2)', 'No Legal Standing (1)', 'Dissolved (1)', 'Revoked (2)', 'Term Expired (1)'].map((filter) => (
              <button key={filter} className="px-3 py-1 bg-[#3A4A62] text-[#9CA3AF] rounded text-sm hover:bg-[#6366F1] hover:text-white">
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="bg-yellow-900/10 border border-yellow-900/20 p-4 rounded-lg">
            <div className="font-semibold text-white">River Park Homeowners</div>
            <div className="text-sm text-[#6B7280] mt-1">HOA-2023-067</div>
            <div className="mt-2 text-sm"><span className="text-yellow-400 font-semibold">SANCTIONED</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function LegalWorkflow() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Legal Workflow</h1>
        <p className="text-[#9CA3AF] text-sm mt-1">Track the progression of legal actions (NOV → OTP → OIAS → MR)</p>
      </div>

      <div className="bg-[#242B3D] border border-[#3A4A62] rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-6">Legal Action Flow</h2>
        <div className="flex items-center justify-between">
          {['NOV', 'OTP', 'OIAS', 'MR'].map((stage, idx) => (
            <div key={stage} className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-[#6366F1] flex items-center justify-center text-white font-bold">{stage}</div>
              {idx < 3 && <div className="flex-1 h-1 bg-[#3A4A62] mx-2"></div>}
            </div>
          ))}
        </div>
        <p className="text-[#9CA3AF] text-sm mt-4">Notice of Violation → Order of Termination → Order of Imposition → Motion for Reconsideration</p>
      </div>
    </div>
  );
}

export default {
  NoticeOfViolation,
  OrderOfTermination,
  OrderOfImposition,
  MotionForReconsideration,
  ComplianceStatus,
  LegalWorkflow
};
