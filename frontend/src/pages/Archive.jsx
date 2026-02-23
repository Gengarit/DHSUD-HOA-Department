import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Archive as ArchiveIcon, Search, RotateCcw, Trash2 } from 'lucide-react';
import ConfirmDialog from '../components/ConfirmDialog';
import AlertDialog from '../components/AlertDialog';

const Archive = () => {
  const [archivedApplicants, setArchivedApplicants] = useState([]);
  const [filteredApplicants, setFilteredApplicants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [confirmRestore, setConfirmRestore] = useState({ show: false, id: null, name: '' });
  const [confirmDelete, setConfirmDelete] = useState({ show: false, id: null, name: '' });
  const [alert, setAlert] = useState({ show: false, title: '', message: '', type: 'info' });

  useEffect(() => {
    fetchArchived();
  }, []);

  useEffect(() => {
    filterApplicants();
  }, [searchTerm, archivedApplicants]);

  const fetchArchived = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/archived');
      setArchivedApplicants(response.data);
      setFilteredApplicants(response.data);
    } catch (error) {
      console.error('Error fetching archived applicants:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterApplicants = () => {
    if (!searchTerm) {
      setFilteredApplicants(archivedApplicants);
      return;
    }

    const filtered = archivedApplicants.filter(
      (app) =>
        app.control_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.city.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredApplicants(filtered);
  };

  const handleRestore = (applicant) => {
    setConfirmRestore({ 
      show: true, 
      id: applicant.id, 
      name: `${applicant.first_name} ${applicant.last_name}` 
    });
  };

  const confirmRestoreAction = async () => {
    try {
      await axios.put(`http://localhost:5000/api/archived/${confirmRestore.id}/restore`);
      fetchArchived();
      setAlert({ 
        show: true, 
        title: 'Success', 
        message: 'Applicant restored successfully', 
        type: 'success' 
      });
    } catch (error) {
      console.error('Error restoring applicant:', error);
      setAlert({ 
        show: true, 
        title: 'Error', 
        message: 'Failed to restore applicant', 
        type: 'error' 
      });
    }
    setConfirmRestore({ show: false, id: null, name: '' });
  };

  const handlePermanentDelete = (applicant) => {
    setConfirmDelete({ 
      show: true, 
      id: applicant.id, 
      name: `${applicant.first_name} ${applicant.last_name}` 
    });
  };

  const confirmDeleteAction = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/archived/${confirmDelete.id}`);
      fetchArchived();
      setAlert({ 
        show: true, 
        title: 'Success', 
        message: 'Applicant permanently deleted', 
        type: 'success' 
      });
    } catch (error) {
      console.error('Error deleting applicant:', error);
      setAlert({ 
        show: true, 
        title: 'Error', 
        message: 'Failed to delete applicant', 
        type: 'error' 
      });
    }
    setConfirmDelete({ show: false, id: null, name: '' });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-text">Archive</h1>
          <p className="text-gray-400 mt-1">Deleted applicant records</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-card rounded-lg border border-border">
          <ArchiveIcon className="text-accent" size={24} />
          <div>
            <div className="text-sm text-gray-400">Archived Records</div>
            <div className="text-2xl font-bold text-text">{archivedApplicants.length}</div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-card rounded-xl p-4 border border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search archived applicants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-background text-text pl-10 pr-4 py-3 rounded-lg border border-border focus:outline-none focus:border-accent"
          />
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-accent/10 border border-accent rounded-xl p-4">
        <div className="flex items-start gap-3">
          <ArchiveIcon className="text-accent mt-0.5" size={20} />
          <div className="flex-1 text-sm text-gray-300">
            <p className="font-medium text-accent mb-1">Archive Information</p>
            <p>
              Deleted applicants are stored in the archive instead of being permanently removed. 
              You can restore them to active records or permanently delete them from here.
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading archived applicants...</div>
        ) : filteredApplicants.length === 0 ? (
          <div className="p-8 text-center">
            <ArchiveIcon className="mx-auto mb-3 text-gray-500" size={48} />
            <p className="text-gray-400">
              {searchTerm ? 'No archived applicants found matching your search' : 'No archived applicants'}
            </p>
          </div>
        ) : (
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
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">
                    Archived Date
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredApplicants.map((applicant) => (
                  <tr key={applicant.id} className="hover:bg-background/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-accent">{applicant.control_number}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-text">
                        {applicant.first_name} {applicant.last_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-300">{applicant.city}</td>
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {formatDate(applicant.archived_at)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleRestore(applicant)}
                          className="flex items-center gap-1 px-3 py-2 bg-success/20 hover:bg-success/30 text-success rounded-lg transition-colors"
                          title="Restore"
                        >
                          <RotateCcw size={16} />
                          <span className="text-sm">Restore</span>
                        </button>
                        <button
                          onClick={() => handlePermanentDelete(applicant)}
                          className="flex items-center gap-1 px-3 py-2 bg-danger/20 hover:bg-danger/30 text-danger rounded-lg transition-colors"
                          title="Permanent Delete"
                        >
                          <Trash2 size={16} />
                          <span className="text-sm">Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirm Restore Dialog */}
      <ConfirmDialog
        isOpen={confirmRestore.show}
        title="Restore Applicant"
        message={`Are you sure you want to restore "${confirmRestore.name}" to active records?`}
        confirmText="Restore"
        cancelText="Cancel"
        type="success"
        onConfirm={confirmRestoreAction}
        onClose={() => setConfirmRestore({ show: false, id: null, name: '' })}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={confirmDelete.show}
        title="Permanent Delete"
        message={`Are you sure you want to permanently delete "${confirmDelete.name}"? This action cannot be undone!`}
        confirmText="Delete Permanently"
        cancelText="Cancel"
        type="danger"
        onConfirm={confirmDeleteAction}
        onClose={() => setConfirmDelete({ show: false, id: null, name: '' })}
      />

      {/* Alert Dialog */}
      <AlertDialog
        isOpen={alert.show}
        title={alert.title}
        message={alert.message}
        type={alert.type}
        onClose={() => setAlert({ show: false, title: '', message: '', type: 'info' })}
      />
    </div>
  );
};

export default Archive;
