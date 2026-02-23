import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShieldAlert, Search, Shield } from 'lucide-react';
import ConfirmDialog from '../components/ConfirmDialog';
import AlertDialog from '../components/AlertDialog';

const Blacklist = () => {
  const [blacklistedApplicants, setBlacklistedApplicants] = useState([]);
  const [filteredApplicants, setFilteredApplicants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [confirmRemove, setConfirmRemove] = useState({ show: false, id: null });
  const [alert, setAlert] = useState({ show: false, title: '', message: '', type: 'info' });

  useEffect(() => {
    fetchBlacklist();
  }, []);

  useEffect(() => {
    filterApplicants();
  }, [searchTerm, blacklistedApplicants]);

  const fetchBlacklist = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/blacklist');
      setBlacklistedApplicants(response.data);
      setFilteredApplicants(response.data);
    } catch (error) {
      console.error('Error fetching blacklist:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterApplicants = () => {
    if (!searchTerm) {
      setFilteredApplicants(blacklistedApplicants);
      return;
    }

    const filtered = blacklistedApplicants.filter(
      (app) =>
        app.control_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.city.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredApplicants(filtered);
  };

  const handleRemoveFromBlacklist = async (id) => {
    setConfirmRemove({ show: true, id });
  };

  const confirmRemoveAction = async () => {
    try {
      await axios.put(`http://localhost:5000/api/applicants/${confirmRemove.id}`, {
        is_blacklisted: false
      });
      fetchBlacklist();
      setAlert({ 
        show: true, 
        title: 'Success', 
        message: 'Applicant removed from blacklist successfully', 
        type: 'success' 
      });
    } catch (error) {
      console.error('Error removing from blacklist:', error);
      setAlert({ 
        show: true, 
        title: 'Error', 
        message: 'Failed to remove from blacklist', 
        type: 'error' 
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <ShieldAlert className="text-danger" size={32} />
        <div>
          <h1 className="text-3xl font-bold text-text">Blacklist</h1>
          <p className="text-gray-400 mt-1">
            Blacklisted accounts with restricted modifications
          </p>
        </div>
      </div>

      {/* Warning Banner */}
      <div className="bg-danger/10 border border-danger rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Shield className="text-danger mt-1" size={20} />
          <div>
            <h3 className="text-danger font-semibold">Security Notice</h3>
            <p className="text-gray-300 text-sm mt-1">
              Blacklisted accounts cannot have their control numbers modified. Any attempt
              to edit these records will be blocked by the system.
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-card rounded-xl p-4 border border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search blacklisted applicants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-background text-text pl-10 pr-4 py-3 rounded-lg border border-border focus:outline-none focus:border-accent"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-background border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">
                  Control Number
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">
                  City
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-400">
                    Loading...
                  </td>
                </tr>
              ) : filteredApplicants.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-400">
                    No blacklisted applicants found
                  </td>
                </tr>
              ) : (
                filteredApplicants.map((applicant) => (
                  <tr key={applicant.id} className="hover:bg-background/50 transition-colors">
                    <td className="px-6 py-4 text-text font-medium">
                      <div className="flex items-center gap-2">
                        <Shield className="text-danger" size={16} />
                        {applicant.control_number}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-text">
                      {applicant.first_name} {applicant.last_name}
                    </td>
                    <td className="px-6 py-4 text-text">{applicant.city}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleRemoveFromBlacklist(applicant.id)}
                        className="px-4 py-2 bg-success hover:bg-success/80 text-white rounded-lg font-medium transition-colors text-sm"
                      >
                        Remove from Blacklist
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Remove Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmRemove.show}
        onClose={() => setConfirmRemove({ show: false, id: null })}
        onConfirm={confirmRemoveAction}
        title="Remove from Blacklist"
        message="Are you sure you want to remove this applicant from the blacklist?"
        confirmText="Remove"
        cancelText="Cancel"
        type="warning"
      />

      {/* Alert Dialog */}
      <AlertDialog
        isOpen={alert.show}
        onClose={() => setAlert({ show: false, title: '', message: '', type: 'info' })}
        title={alert.title}
        message={alert.message}
        type={alert.type}
      />
    </div>
  );
};

export default Blacklist;
