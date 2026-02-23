import React from 'react';
import { Plus } from 'lucide-react';

function OrderOfImposition() {
  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-white">Order of Imposition of Administrative Sanctions (OIAS)</h1>
          <p className="text-[#9CA3AF] text-sm mt-1">Track administrative sanctions imposed on HOAs</p>
        </div>
        <button className="bg-[#6366F1] hover:bg-[#7C3AED] text-white py-2 px-4 rounded-lg flex items-center gap-2">
          <Plus size={18} /> Create New OIAS
        </button>
      </div>

      <div className="space-y-4">
        <div className="bg-red-900/20 border border-red-900/40 rounded-lg p-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="font-semibold text-white">Mountain Ridge HOA</div>
              <div className="text-sm text-[#9CA3AF] mt-1">HOA-2023-089</div>
              <div className="text-sm text-[#6B7280] mt-2">OIAS Control Number: <span className="text-red-400 font-mono font-bold">OIAS-2026-001</span></div>
              <div className="text-sm mt-2">Sanction Amount: <span className="text-red-400 font-bold text-lg">₱50,000</span></div>
              <div className="text-sm text-[#6B7280] mt-2">Status: <span className="text-red-400 font-medium">Active</span></div>
            </div>
            <button className="bg-[#6366F1] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#7C3AED]">
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderOfImposition;
