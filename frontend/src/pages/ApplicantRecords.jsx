import React, { useState, useEffect, useMemo, useRef } from 'react';
import axios from 'axios';
import { Plus, Search, Edit2, Trash2, Shield, Download, Upload, ChevronDown, CheckSquare, Square } from 'lucide-react';
import ApplicantForm from '../components/ApplicantForm';
import BlacklistWarning from '../components/BlacklistWarning';
import ConfirmDialog from '../components/ConfirmDialog';
import AlertDialog from '../components/AlertDialog';

const ApplicantRecords = () => {
  const [applicants, setApplicants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingApplicant, setEditingApplicant] = useState(null);
  const [showBlacklistWarning, setShowBlacklistWarning] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState({ show: false, id: null });
  const [alert, setAlert] = useState({ show: false, title: '', message: '', type: 'info' });
  const fileInputRef = useRef(null);
  
  // Filter and sort state
  const [filters, setFilters] = useState({
    city: 'all',
    status: 'all',
    blacklisted: 'false',
    archived: 'false'
  });
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('DESC');
  const [selectedApplicants, setSelectedApplicants] = useState(new Set());
  const [cities, setCities] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 50;

  
  useEffect(() => {
    fetchApplicants();
  }, [filters.archived]);

  useEffect(() => {
    const handle = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(handle);
  }, [searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortBy, sortOrder, debouncedSearchTerm]);

  const fetchApplicants = async () => {
    try {
      setLoading(true);
      const endpoint = filters.archived === 'true'
        ? 'http://localhost:5000/api/archived'
        : 'http://localhost:5000/api/applicants';
      const response = await axios.get(endpoint);
      setApplicants(response.data);
      setSelectedApplicants(new Set());
      
      // Extract unique cities from the response data
      if (response.data.length > 0) {
        const uniqueCities = [...new Set(response.data.map(a => a.city))].sort();
        setCities(uniqueCities);
      }
    } catch (error) {
      console.error('Error fetching applicants:', error);
      setAlert({
        show: true,
        title: 'Error',
        message: 'Failed to fetch applicants',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const preparedApplicants = useMemo(() => (
    applicants.map((app) => {
      const normalizedDate = app.created_at && app.created_at.includes(' ')
        ? app.created_at.replace(' ', 'T')
        : app.created_at;
      const createdAt = normalizedDate ? new Date(normalizedDate).getTime() : 0;
      return {
        ...app,
        _sort: {
          control_number: (app.control_number ?? '').toString().toLowerCase(),
          first_name: (app.first_name ?? '').toString().toLowerCase(),
          last_name: (app.last_name ?? '').toString().toLowerCase(),
          city: (app.city ?? '').toString().toLowerCase(),
          status: (app.status ?? '').toString().toLowerCase(),
          created_at: Number.isNaN(createdAt) ? 0 : createdAt
        }
      };
    })
  ), [applicants]);

  const filteredApplicants = useMemo(() => {
    let filtered = [...preparedApplicants];

    if (filters.city !== 'all') {
      filtered = filtered.filter((app) => app.city === filters.city);
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter((app) => app.status === filters.status);
    }

    if (filters.blacklisted === 'true') {
      filtered = filtered.filter((app) => app.is_blacklisted);
    }

    if (debouncedSearchTerm) {
      const term = debouncedSearchTerm.toLowerCase();
      filtered = filtered.filter(
        (app) =>
          app._sort.control_number.includes(term) ||
          app._sort.first_name.includes(term) ||
          app._sort.last_name.includes(term) ||
          app._sort.city.includes(term)
      );
    }

    filtered.sort((a, b) => {
      if (sortBy === 'created_at') {
        return sortOrder === 'DESC'
          ? b._sort.created_at - a._sort.created_at
          : a._sort.created_at - b._sort.created_at;
      }

      const aValue = a._sort[sortBy] ?? '';
      const bValue = b._sort[sortBy] ?? '';
      if (aValue < bValue) return sortOrder === 'DESC' ? 1 : -1;
      if (aValue > bValue) return sortOrder === 'DESC' ? -1 : 1;
      return 0;
    });

    return filtered;
  }, [preparedApplicants, filters, sortBy, sortOrder, debouncedSearchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredApplicants.length / pageSize));
  const pagedApplicants = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredApplicants.slice(start, start + pageSize);
  }, [filteredApplicants, currentPage, pageSize]);

  const handleSortChange = (field) => {
    if (field === sortBy) {
      setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
      return;
    }

    setSortBy(field);
    setSortOrder(field === 'created_at' ? 'DESC' : 'ASC');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const normalized = dateString.includes(' ') ? dateString.replace(' ', 'T') : dateString;
    const date = new Date(normalized);
    if (Number.isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    });
  };

  const handleEdit = (applicant) => {
    // FRONTEND GUARD: Check if blacklisted
    if (applicant.is_blacklisted) {
      setShowBlacklistWarning(true);
      return;
    }
    setEditingApplicant(applicant);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    setConfirmDelete({ show: true, id });
  };

  const confirmDeleteAction = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/applicants/${confirmDelete.id}`);
      fetchApplicants();
      setAlert({ 
        show: true, 
        title: 'Success', 
        message: 'Applicant moved to archive', 
        type: 'success' 
      });
    } catch (error) {
      console.error('Error archiving applicant:', error);
      setAlert({ 
        show: true, 
        title: 'Error', 
        message: 'Failed to archive applicant', 
        type: 'error' 
      });
    }
  };

  const toggleSelectApplicant = (id) => {
    const newSelected = new Set(selectedApplicants);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedApplicants(newSelected);
  };

  const toggleSelectAll = () => {
    const pageIds = pagedApplicants.map((app) => app.id);
    const newSelected = new Set(selectedApplicants);
    const allSelected = pageIds.length > 0 && pageIds.every((id) => newSelected.has(id));

    if (allSelected) {
      pageIds.forEach((id) => newSelected.delete(id));
    } else {
      pageIds.forEach((id) => newSelected.add(id));
    }

    setSelectedApplicants(newSelected);
  };

  const handleBulkArchive = async () => {
    if (selectedApplicants.size === 0) {
      setAlert({ show: true, title: 'Error', message: 'No applicants selected', type: 'error' });
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/applicants/bulk/archive', {
        ids: Array.from(selectedApplicants)
      });
      fetchApplicants();
      setAlert({
        show: true,
        title: 'Success',
        message: `Archived ${selectedApplicants.size} applicants`,
        type: 'success'
      });
    } catch (error) {
      console.error('Error archiving applicants:', error);
      setAlert({ show: true, title: 'Error', message: 'Failed to archive applicants', type: 'error' });
    }
  };

  const handleBulkStatusChange = async (newStatus) => {
    if (selectedApplicants.size === 0) {
      setAlert({ show: true, title: 'Error', message: 'No applicants selected', type: 'error' });
      return;
    }

    if (!newStatus) {
      setAlert({ show: true, title: 'Error', message: 'Please choose a status', type: 'error' });
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/applicants/bulk/status', {
        ids: Array.from(selectedApplicants),
        status: newStatus
      });
      fetchApplicants();
      setAlert({
        show: true,
        title: 'Success',
        message: `Updated ${selectedApplicants.size} applicants to ${newStatus}`,
        type: 'success'
      });
    } catch (error) {
      console.error('Error updating status:', error);
      setAlert({ show: true, title: 'Error', message: 'Failed to update status', type: 'error' });
    }
  };

  const handleRestore = async (applicantId) => {
    try {
      await axios.put(`http://localhost:5000/api/applicants/${applicantId}/restore`);
      fetchApplicants();
      setAlert({ show: true, title: 'Success', message: 'Applicant restored', type: 'success' });
    } catch (error) {
      console.error('Error restoring applicant:', error);
      setAlert({ show: true, title: 'Error', message: 'Failed to restore applicant', type: 'error' });
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingApplicant(null);
    fetchApplicants();
  };

  const handleExportCSV = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/export/csv', {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `DHSUD_Applicants_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      setAlert({
        show: true,
        title: 'Success',
        message: 'CSV file exported successfully',
        type: 'success'
      });
    } catch (error) {
      console.error('Error exporting CSV:', error);
      setAlert({
        show: true,
        title: 'Error',
        message: 'Failed to export CSV file',
        type: 'error'
      });
    }
  };

  const handleImportCSV = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!file.name.endsWith('.csv')) {
      setAlert({
        show: true,
        title: 'Error',
        message: 'Please select a CSV file',
        type: 'error'
      });
      return;
    }
    
    const formData = new FormData();
    formData.append('file', file);
    
    setLoading(true);
    
    axios.post('http://localhost:5000/api/import/csv', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(response => {
      fetchApplicants();

      const errors = Array.isArray(response.data.errors) ? response.data.errors : [];
      const successful = Number.isFinite(response.data.successful) ? response.data.successful : 0;
      const failed = Number.isFinite(response.data.failed) ? response.data.failed : 0;
      const total = Number.isFinite(response.data.total) ? response.data.total : successful + failed;

      const messageContent = (
        <div className="space-y-4">
          <p className="text-text">
            {failed > 0
              ? 'Import completed with some issues. Review the rows below and re-import only the corrected rows.'
              : 'Import completed successfully.'}
          </p>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg border border-border bg-background/40 p-3 text-center">
              <div className="text-xs text-gray-400">Total Rows</div>
              <div className="text-lg font-semibold text-text">{total}</div>
            </div>
            <div className="rounded-lg border border-border bg-success/10 p-3 text-center">
              <div className="text-xs text-gray-400">Successful</div>
              <div className="text-lg font-semibold text-success">{successful}</div>
            </div>
            <div className="rounded-lg border border-border bg-danger/10 p-3 text-center">
              <div className="text-xs text-gray-400">Failed</div>
              <div className="text-lg font-semibold text-danger">{failed}</div>
            </div>
          </div>

          {failed > 0 && (
            <div className="space-y-2">
              <div className="text-sm text-gray-400">Rows with issues (first 5)</div>
              <div className="max-h-40 overflow-auto rounded-lg border border-border bg-background/40 p-3 text-sm text-text">
                <ul className="list-disc space-y-1 pl-5">
                  {errors.slice(0, 5).map((item, index) => (
                    <li key={`${item.row}-${index}`}>
                      Row {item.row}: {item.error}
                    </li>
                  ))}
                </ul>
                {errors.length > 5 && (
                  <div className="mt-2 text-xs text-gray-400">
                    + {errors.length - 5} more rows not shown
                  </div>
                )}
              </div>
              <div className="text-xs text-gray-400">
                Tip: Fix the rows listed above and re-import only those rows.
              </div>
            </div>
          )}
        </div>
      );

      setAlert({
        show: true,
        title: 'Import Results',
        message: messageContent,
        type: failed > 0 ? 'info' : 'success'
      });
    })
    .catch(error => {
      console.error('Error importing CSV:', error);
      setAlert({
        show: true,
        title: 'Error',
        message: error.response?.data?.error || 'Failed to import CSV file',
        type: 'error'
      });
    })
    .finally(() => {
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-text">Applicant Records</h1>
          <p className="text-gray-400 mt-1">Manage all applicant information</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Export CSV Button */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-success hover:bg-success/80 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            title="Export to CSV"
          >
            <Download size={20} />
            Export CSV
          </button>
          
          {/* Import CSV Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 bg-warning hover:bg-warning/80 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            title="Import from CSV"
          >
            <Upload size={20} />
            Import CSV
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleImportCSV}
            className="hidden"
          />
          
          {/* Add Applicant Button */}
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-accent hover:bg-accentHover text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <Plus size={20} />
            Add Applicant
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-card rounded-xl p-4 border border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by control number, name, or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-background text-text pl-10 pr-4 py-3 rounded-lg border border-border focus:outline-none focus:border-accent"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-xl p-4 border border-border grid grid-cols-5 gap-3">
        <div>
          <label className="text-xs text-gray-400 mb-2 block">City</label>
          <select
            value={filters.city}
            onChange={(e) => setFilters({ ...filters, city: e.target.value })}
            className="w-full bg-background text-text px-3 py-2 rounded-lg border border-border focus:outline-none focus:border-accent text-sm"
          >
            <option value="all">All Cities</option>
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="text-xs text-gray-400 mb-2 block">Status</label>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="w-full bg-background text-text px-3 py-2 rounded-lg border border-border focus:outline-none focus:border-accent text-sm"
          >
            <option value="all">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Under Review">Under Review</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="On Hold">On Hold</option>
          </select>
        </div>

        <div>
          <label className="text-xs text-gray-400 mb-2 block">Blacklist</label>
          <select
            value={filters.blacklisted}
            onChange={(e) => setFilters({ ...filters, blacklisted: e.target.value })}
            className="w-full bg-background text-text px-3 py-2 rounded-lg border border-border focus:outline-none focus:border-accent text-sm"
          >
            <option value="false">All</option>
            <option value="true">Blacklisted Only</option>
          </select>
        </div>

        <div>
          <label className="text-xs text-gray-400 mb-2 block">Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className="w-full bg-background text-text px-3 py-2 rounded-lg border border-border focus:outline-none focus:border-accent text-sm"
          >
            <option value="created_at">Date (Newest)</option>
            <option value="control_number">Control #</option>
            <option value="first_name">First Name</option>
            <option value="last_name">Last Name</option>
            <option value="city">City</option>
            <option value="status">Status</option>
          </select>
        </div>

        <div>
          <label className="text-xs text-gray-400 mb-2 block">View</label>
          <select
            value={filters.archived}
            onChange={(e) => setFilters({ ...filters, archived: e.target.value })}
            className="w-full bg-background text-text px-3 py-2 rounded-lg border border-border focus:outline-none focus:border-accent text-sm"
          >
            <option value="false">Active</option>
            <option value="true">Archived</option>
          </select>
        </div>
      </div>

      {/* Bulk Operations */}
      {selectedApplicants.size > 0 && (
        <div className="bg-accent/10 border border-accent rounded-xl p-4 flex justify-between items-center">
          <span className="text-text font-medium">{selectedApplicants.size} applicant(s) selected</span>
          <div className="flex gap-2">
            <select
              onChange={(e) => handleBulkStatusChange(e.target.value)}
              defaultValue=""
              className="bg-warning hover:bg-warning/80 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <option value="">Change Status...</option>
              <option value="Pending">Pending</option>
              <option value="Under Review">Under Review</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="On Hold">On Hold</option>
            </select>
            <button
              onClick={handleBulkArchive}
              className="bg-danger hover:bg-dangerHover text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
            >
              Archive Selected
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-background border-b border-border">
              <tr>
                <th className="px-4 py-4 text-left text-sm font-semibold text-gray-400">
                  <input
                    type="checkbox"
                    checked={pagedApplicants.length > 0 && pagedApplicants.every((app) => selectedApplicants.has(app.id))}
                    onChange={toggleSelectAll}
                    className="rounded cursor-pointer"
                  />
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400 cursor-pointer hover:text-text"
                    onClick={() => handleSortChange('control_number')}>
                  Control Number
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400 cursor-pointer hover:text-text"
                    onClick={() => handleSortChange('first_name')}>
                  Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400 cursor-pointer hover:text-text"
                    onClick={() => handleSortChange('city')}>
                  City
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400 cursor-pointer hover:text-text"
                    onClick={() => handleSortChange('status')}>
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400 cursor-pointer hover:text-text"
                    onClick={() => handleSortChange('created_at')}>
                  Date Added
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-400">
                    Loading...
                  </td>
                </tr>
              ) : filteredApplicants.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-400">
                    No applicants found
                  </td>
                </tr>
              ) : (
                pagedApplicants.map((applicant) => (
                  <tr key={applicant.id} className="hover:bg-background/50 transition-colors">
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedApplicants.has(applicant.id)}
                        onChange={() => toggleSelectApplicant(applicant.id)}
                        className="rounded cursor-pointer"
                      />
                    </td>
                    <td className="px-6 py-4 text-text font-medium">
                      {applicant.control_number}
                    </td>
                    <td className="px-6 py-4 text-text">
                      {applicant.first_name} {applicant.last_name}
                    </td>
                    <td className="px-6 py-4 text-text">{applicant.city}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                        ${applicant.status === 'Approved' ? 'bg-success/10 text-success' : 
                          applicant.status === 'Rejected' ? 'bg-danger/10 text-danger' :
                          applicant.status === 'Under Review' ? 'bg-warning/10 text-warning' :
                          applicant.status === 'On Hold' ? 'bg-gray-600/10 text-gray-400' :
                          'bg-accent/10 text-accent'}`}>
                        {applicant.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-text">
                      {formatDate(applicant.created_at)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {applicant.is_archived ? (
                          <>
                            <button
                              onClick={() => handleRestore(applicant.id)}
                              className="px-3 py-1 text-sm bg-success/10 text-success hover:bg-success/20 rounded-lg transition-colors font-medium"
                              title="Restore"
                            >
                              Restore
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEdit(applicant)}
                              className="p-2 text-accent hover:bg-accent/10 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(applicant.id)}
                              className="p-2 text-danger hover:bg-danger/10 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {filteredApplicants.length > pageSize && (
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>
            Showing {(currentPage - 1) * pageSize + 1}-
            {Math.min(currentPage * pageSize, filteredApplicants.length)} of {filteredApplicants.length}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-lg border border-border text-text disabled:opacity-40"
            >
              Prev
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-lg border border-border text-text disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <ApplicantForm
          applicant={editingApplicant}
          onClose={handleFormClose}
        />
      )}

      {/* Blacklist Warning Modal */}
      {showBlacklistWarning && (
        <BlacklistWarning onClose={() => setShowBlacklistWarning(false)} />
      )}

      {/* Archive Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDelete.show}
        onClose={() => setConfirmDelete({ show: false, id: null })}
        onConfirm={confirmDeleteAction}
        title="Archive Applicant"
        message="Are you sure you want to archive this applicant? You can restore it later from the Archive page."
        confirmText="Archive"
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

export default ApplicantRecords;
