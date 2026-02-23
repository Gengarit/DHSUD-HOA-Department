import React from 'react';
import { Plus } from 'lucide-react';

function MotionForReconsideration() {
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
        <div className="lg:col-span-1 bg-[#242B3D] border border-[#3A4A62] rounded-lg p-6">
          <h3 className="text-white font-semibold mb-3">MR Records</h3>
          <input type="text" placeholder="Search MR..." className="w-full bg-[#1A1F2B] border border-[#3A4A62] text-white px-3 py-2 rounded-lg text-sm mb-3" />
          <div className="space-y-2">
            <div className="p-3 bg-[#1A1F2B] border border-[#3A4A62] rounded-lg cursor-pointer hover:border-[#6366F1]">
              <div className="text-[#6366F1] font-medium text-sm">MR-2026-001</div>
              <div className="text-[11px] text-[#6B7280]">Hillside Manor Association</div>
              <span className="text-[10px] px-2 py-1 bg-blue-900/30 text-blue-400 rounded mt-2 inline-block">Under Review</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-[#242B3D] border border-[#3A4A62] rounded-lg p-6">
          <h3 className="text-white font-semibold mb-4">MR Details</h3>
          <div className="space-y-4">
            <div>
              <div className="text-[#6B7280] text-[11px]">Control Number</div>
              <div className="text-white font-semibold text-lg mt-1">MR-2026-001</div>
            </div>
            <div>
              <div className="text-[#6B7280] text-[11px]">Origin Control Number</div>
              <div className="text-white mt-1">OTP-2025-015</div>
            </div>
            <div>
              <div className="text-[#6B7280] text-[11px]">Grounds for Reconsideration</div>
              <div className="text-white mt-1 text-sm">Procedural errors in issuance of termination order</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MotionForReconsideration;
