import React, { useEffect, useState } from 'react';
import { Search, Eye, Plus } from 'lucide-react';

function HOAManagement() {
  const [hoas, setHoas] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchHoas();
  }, []);

  const fetchHoas = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/hoas');
      const data = await response.json();
      setHoas(data);
    } catch (err) {
      console.error('Error fetching HOAs:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredHoas = hoas.filter(hoa => {
    const matches = !search || 
      hoa.hoa_name?.toLowerCase().includes(search.toLowerCase()) ||
      hoa.cert_of_inc_no?.toLowerCase().includes(search.toLowerCase());
    
    if (filter === 'All') return matches;
    if (filter === 'In Good Standing') return matches && hoa.status_findings === 'In Good Standing';
    if (filter === 'Under Review') return matches && hoa.status_findings === 'Under Review';
    if (filter === 'Sanctioned') return matches && hoa.status_findings === 'Sanctioned';
    return matches;
  });

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-white">HOA Management</h1>
          <p className="text-[#9CA3AF] text-sm mt-1">Comprehensive list of registered homeowners associations</p>
        </div>
        <button className="bg-[#6366F1] hover:bg-[#7C3AED] text-white py-2 px-4 rounded-lg font-medium flex items-center gap-2 transition">
          <Plus size={18} /> Create New HOA
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-[#242B3D] border border-[#3A4A62] rounded-lg p-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-3 text-[#6B7280]" />
            <input
              type="text"
              placeholder="Search by HOA name, ID, or president..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#1A1F2B] border border-[#3A4A62] text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-[#6366F1]"
            />
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {['All', 'In Good Standing', 'Under Review', 'Sanctioned'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filter === status
                  ? 'bg-[#6366F1] text-white shadow-lg'
                  : 'bg-[#1A1F2B] text-[#9CA3AF] hover:bg-[#3A4A62] hover:text-white border border-[#3A4A62]'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* HOAs Table */}
      <div className="bg-[#242B3D] border border-[#3A4A62] rounded-lg overflow-hidden">
        <table className="w-full text-left text-[#9CA3AF] text-sm">
          <thead className="bg-[#1A1F2B] border-b border-[#3A4A62]">
            <tr>
              <th className="px-6 py-3 font-semibold text-white">HOA ID</th>
              <th className="px-6 py-3 font-semibold text-white">Name</th>
              <th className="px-6 py-3 font-semibold text-white">President</th>
              <th className="px-6 py-3 font-semibold text-white">Location</th>
              <th className="px-6 py-3 font-semibold text-white">Members</th>
              <th className="px-6 py-3 font-semibold text-white">Registration Date</th>
              <th className="px-6 py-3 font-semibold text-white">Status</th>
              <th className="px-6 py-3 font-semibold text-white">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#3A4A62]">
            {filteredHoas.map((hoa) => (
              <tr key={hoa.cert_of_inc_no} className="hover:bg-[#2D3A52] transition">
                <td className="px-6 py-3">
                  <span className="text-[#6366F1] font-medium">{hoa.cert_of_inc_no}</span>
                </td>
                <td className="px-6 py-3">
                  <div>
                    <div className="text-white font-medium">{hoa.hoa_name}</div>
                    <div className="text-xs text-[#6B7280]">{hoa.contact_details}</div>
                  </div>
                </td>
                <td className="px-6 py-3 text-white">{hoa.contact_person}</td>
                <td className="px-6 py-3">{hoa.city_municipality}, {hoa.barangay}</td>
                <td className="px-6 py-3 text-white">{hoa.total_members}</td>
                <td className="px-6 py-3">{new Date(hoa.issuance_date).toLocaleDateString()}</td>
                <td className="px-6 py-3">
                  <span
                    className={`px-3 py-1 rounded-lg text-xs font-medium ${
                      hoa.status_findings === 'Sanctioned'
                        ? 'bg-red-900/40 text-red-400 border border-red-800/50'
                        : hoa.status_findings === 'Under Review'
                        ? 'bg-yellow-900/40 text-yellow-400 border border-yellow-800/50'
                        : 'bg-green-900/40 text-green-400 border border-green-800/50'
                    }`}
                  >
                    {hoa.status_findings || 'Unknown'}
                  </span>
                </td>
                <td className="px-6 py-3">
                  <button className="text-[#6366F1] hover:text-white transition">
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredHoas.length === 0 && (
        <div className="text-center py-12 text-[#6B7280]">
          No HOAs found. Try adjusting your filters.
        </div>
      )}
    </div>
  );
}

export default HOAManagement;
