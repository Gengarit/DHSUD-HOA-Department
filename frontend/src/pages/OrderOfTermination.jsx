import React from 'react';
import { Plus } from 'lucide-react';

function OrderOfTermination() {
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

      <div className="bg-[#242B3D] border border-[#3A4A62] rounded-lg overflow-hidden">
        <table className="w-full text-left text-[#9CA3AF] text-sm">
          <thead className="bg-[#1A1F2B] border-b border-[#3A4A62]">
            <tr>
              <th className="px-6 py-3 text-white font-semibold">Control Number</th>
              <th className="px-6 py-3 text-white font-semibold">HOA Name</th>
              <th className="px-6 py-3 text-white font-semibold">Status</th>
              <th className="px-6 py-3 text-white font-semibold">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#3A4A62]">
            <tr className="hover:bg-[#2D3A52]">
              <td className="px-6 py-3 text-[#6366F1] font-medium">OTP-2026-001</td>
              <td className="px-6 py-3 text-white">River Park Homeowners</td>
              <td className="px-6 py-3"><span className="text-red-400 font-medium">Active</span></td>
              <td className="px-6 py-3">Feb 10</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrderOfTermination;
