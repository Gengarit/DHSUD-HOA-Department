import { useEffect, useState } from 'react'
import axios from 'axios'
import * as XLSX from 'xlsx';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';

// --- ICON COMPONENTS ---
const EditIcon = () => (<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>);
const ArchiveIcon = () => (<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>);
const RestoreIcon = () => (<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>);
const TrashIcon = () => (<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>);
const BuildingIcon = () => (<svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>);

const projTypeOptionsList = [
  "OM Subd", "OM Condo", "MCH Subd", "MCH Condo", 
  "EH Subd", "EH Condo", "SH Subd", "SH Condo", 
  "MP", "COL/OS", "Commercial Condo", "Industrial Subd", 
  "Commercial Subd", "Farmlot Subd"
];

const crlsOptionsList = [
  "New LS", "New CR", "Amended LS", "Amended CR", 
  "Replacement of LS", "Replacement of CR", "Compliance Entry Only"
];

interface Application {
  id: number;
  name_of_proj: string;
  proj_owner_dev?: string; 
  status_of_application: string;
  type_of_application: string;
  cr_no: string;
  ls_no: string;
  proj_type: string;
  main_or_compliance: string;
  date_filed: string | null;
  date_issued: string | null;
  date_completion: string | null;
  prov: string;
  mun_city: string;
  street_brgy: string;
  crls_options?: string[];
}

export default function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('All') 
  const [applications, setApplications] = useState<Application[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentView, setCurrentView] = useState<'dashboard' | 'active' | 'archive'>('dashboard')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [isBulkMode, setIsBulkMode] = useState(false)
  
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' })
  const [confirmDialog, setConfirmDialog] = useState<{
    show: boolean; title: string; message: string; action: (() => void) | null; confirmText: string; confirmColor: string;
  }>({
    show: false, title: '', message: '', action: null, confirmText: 'Confirm', confirmColor: 'bg-blue-600'
  })

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
  }

  const requestConfirm = (title: string, message: string, action: () => void, confirmText: string, confirmColor: string) => {
    setConfirmDialog({ show: true, title, message, action, confirmText, confirmColor });
  }

  const emptyForm = {
    name_of_proj: '',
    proj_owner_dev: '',
    status_of_application: 'Ongoing',
    type_of_application: 'New Application',
    cr_no: '',
    ls_no: '',
    proj_type: '',
    main_or_compliance: 'Main',
    date_filed: '',
    date_issued: '',
    date_completion: '',
    prov: '',
    mun_city: '',
    street_brgy: '',
    crls_options: [] as string[]
  }
  const [formData, setFormData] = useState(emptyForm)

  const fetchApplications = () => {
    setIsLoading(true);
    axios.get('http://127.0.0.1:8000/api/applications/')
      .then(response => setApplications(response.data))
      .catch(error => {
        console.error("Error fetching data:", error);
        showNotification("Failed to load projects from server.", "error");
      })
      .finally(() => setIsLoading(false));
  }

  useEffect(() => {
    fetchApplications()
  }, [])

  useEffect(() => {
    setSelectedIds([]);
    setIsBulkMode(false);
  }, [currentView, searchTerm, filterStatus]);

  const activeApps = applications.filter(app => app.status_of_application !== 'Archived')
  const archivedApps = applications.filter(app => app.status_of_application === 'Archived')
  const displayApps = currentView === 'active' ? activeApps : archivedApps

  const stats = {
    ongoing: activeApps.filter(a => a.status_of_application === 'Ongoing').length,
    approved: activeApps.filter(a => a.status_of_application === 'Approved').length,
    denied: activeApps.filter(a => a.status_of_application === 'Denied').length,
    endorsed: activeApps.filter(a => a.status_of_application === 'Endorsed to HREDRB').length,
  }

  const chartData = [
    { name: 'Ongoing', count: stats.ongoing, color: '#3b82f6' },
    { name: 'Approved', count: stats.approved, color: '#10b981' },
    { name: 'Endorsed', count: stats.endorsed, color: '#f59e0b' },
    { name: 'Denied', count: stats.denied, color: '#ef4444' },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316', '#64748b', '#ef4444'];
  
  const projTypeCounts = activeApps.reduce((acc, app) => {
    const type = app.proj_type || 'Unspecified';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieChartData = Object.keys(projTypeCounts)
    .map((key) => ({
      name: key,
      value: projTypeCounts[key],
    }))
    .filter(item => item.value > 0)
    .sort((a, b) => b.value - a.value);

  const filteredApps = displayApps.filter(app => {
    const matchesSearch = app.name_of_proj.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          app.mun_city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || app.status_of_application === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredApps.map(app => app.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleBulkAction = (action: 'archive' | 'restore' | 'delete') => {
    if (selectedIds.length === 0) return;

    let title = '';
    let message = '';
    let confirmText = '';
    let confirmColor = '';
    let apiCall: (id: number) => Promise<any>;

    if (action === 'archive') {
      title = 'Archive Selected';
      message = `Are you sure you want to archive ${selectedIds.length} projects?`;
      confirmText = 'Archive All';
      confirmColor = 'bg-orange-500 hover:bg-orange-600';
      apiCall = (id) => axios.patch(`http://127.0.0.1:8000/api/applications/${id}/`, { status_of_application: 'Archived' });
    } else if (action === 'restore') {
      title = 'Restore Selected';
      message = `Are you sure you want to restore ${selectedIds.length} projects to Active?`;
      confirmText = 'Restore All';
      confirmColor = 'bg-emerald-600 hover:bg-emerald-700';
      apiCall = (id) => axios.patch(`http://127.0.0.1:8000/api/applications/${id}/`, { status_of_application: 'Ongoing' });
    } else {
      title = 'Delete Selected';
      message = `Are you sure you want to permanently delete ${selectedIds.length} projects? This action cannot be undone.`;
      confirmText = 'Delete All';
      confirmColor = 'bg-red-600 hover:bg-red-700';
      apiCall = (id) => axios.delete(`http://127.0.0.1:8000/api/applications/${id}/`);
    }

    requestConfirm(title, message, () => {
      setIsLoading(true);
      Promise.all(selectedIds.map(id => apiCall(id)))
        .then(() => {
          fetchApplications();
          setSelectedIds([]); 
          setIsBulkMode(false); 
          showNotification(`Successfully processed ${selectedIds.length} projects.`, "success");
        })
        .catch(() => {
          fetchApplications(); 
          showNotification("Some operations failed. Please try again.", "error");
        })
        .finally(() => setIsLoading(false));
    }, confirmText, confirmColor);
  };

  const handleExport = () => {
    const dataToExport = filteredApps.map(app => ({
      'Type of Application': app.type_of_application || '',
      'Status of Application': app.status_of_application || '',
      'New or Amended CRLS (Can choose many)': app.crls_options?.join(', ') || '',
      'Main or Compliance': app.main_or_compliance || '',
      'Date Filed': app.date_filed || '',
      'Date Issued': app.date_issued || '',
      'Date Completion': app.date_completion || '',
      'CR No.': app.cr_no || '',
      'LS No.': app.ls_no || '',
      'Name of Proj': app.name_of_proj || '',
      'Proj Owner Dev': app.proj_owner_dev || '', 
      'Prov': app.prov || '',
      'Mun/City': app.mun_city || '',
      'Street/Brgy': app.street_brgy || '',
      'Proj Type': app.proj_type || ''
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Projects");
    XLSX.writeFile(wb, `DHSUD_${currentView}_Export.xlsx`);
    showNotification("Export successfully downloaded!", "success");
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = evt.target?.result;
        const wb = XLSX.read(data, { type: 'array' }); 
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const jsonData: any[] = XLSX.utils.sheet_to_json(ws);

        if (jsonData.length === 0) {
          showNotification("The file appears to be empty.", "error");
          return;
        }

        jsonData.forEach((row) => {
          axios.post('http://127.0.0.1:8000/api/applications/', {
            name_of_proj: row['Name of Proj'] || row['Project Name'] || 'Untitled Project', 
            proj_owner_dev: row['Proj Owner Dev'] || '', 
            proj_type: row['Proj Type'] || '',
            type_of_application: row['Type of Application'] || 'New Application',
            status_of_application: row['Status of Application'] || 'Ongoing',
            main_or_compliance: row['Main or Compliance'] || 'Main',
            prov: row['Prov'] || '',
            mun_city: row['Mun/City'] || '',
            street_brgy: row['Street/Brgy'] || '',
            cr_no: row['CR No.'] || row['CR No'] || '',
            ls_no: row['LS No.'] || row['LS No'] || '',
            crls_options: row['New or Amended CRLS (Can choose many)'] 
              ? row['New or Amended CRLS (Can choose many)'].split(',').map((s: string) => s.trim()) 
              : []
          })
          .then(() => fetchApplications())
          .catch(err => console.error("Import error:", err));
        });

        showNotification(`Successfully imported ${jsonData.length} records!`, "success");
      } catch (error) {
        showNotification("Failed to read file. Please check the format.", "error");
      }
      e.target.value = ''; 
    };
    reader.readAsArrayBuffer(file);
  };

  const handleOpenModal = (app: Application | null = null) => {
    if (app) {
      setEditingId(app.id)
      setFormData({
        name_of_proj: app.name_of_proj,
        proj_owner_dev: app.proj_owner_dev || '', 
        status_of_application: app.status_of_application,
        type_of_application: app.type_of_application,
        cr_no: app.cr_no || '',
        ls_no: app.ls_no || '',
        proj_type: app.proj_type || '',
        main_or_compliance: app.main_or_compliance || 'Main',
        date_filed: app.date_filed || '',
        date_issued: app.date_issued || '',
        date_completion: app.date_completion || '',
        prov: app.prov || '',
        mun_city: app.mun_city || '',
        street_brgy: app.street_brgy || '',
        crls_options: app.crls_options || [] 
      })
    } else {
      setEditingId(null)
      setFormData(emptyForm)
    }
    setIsModalOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const payload = { 
      ...formData,
      date_filed: formData.date_filed === '' ? null : formData.date_filed,
      date_issued: formData.date_issued === '' ? null : formData.date_issued,
      date_completion: formData.date_completion === '' ? null : formData.date_completion,
    }

    const apiCall = editingId 
      ? axios.patch(`http://127.0.0.1:8000/api/applications/${editingId}/`, payload)
      : axios.post('http://127.0.0.1:8000/api/applications/', payload);

    apiCall.then(() => {
        fetchApplications();
        setIsModalOpen(false);
        showNotification(editingId ? "Project updated successfully" : "New project created successfully", "success");
      })
      .catch(err => showNotification("Action failed! Check server connection.", "error"));
  }

  const handleSoftDelete = (id: number) => {
    requestConfirm("Archive Project", "Are you sure you want to move this project to the archives?",
      () => {
        axios.patch(`http://127.0.0.1:8000/api/applications/${id}/`, { status_of_application: 'Archived' })
          .then(() => { fetchApplications(); showNotification("Project successfully archived.", "success"); })
          .catch(() => showNotification("Failed to archive project.", "error"));
      }, "Archive Project", "bg-orange-500 hover:bg-orange-600"
    );
  }

  const handleRestore = (id: number) => {
    requestConfirm("Restore Project", "Do you want to restore this project back to the active list?",
      () => {
        axios.patch(`http://127.0.0.1:8000/api/applications/${id}/`, { status_of_application: 'Ongoing' })
          .then(() => { fetchApplications(); showNotification("Project successfully restored.", "success"); })
          .catch(() => showNotification("Failed to restore project.", "error"));
      }, "Restore Project", "bg-emerald-600 hover:bg-emerald-700"
    );
  }

  const handleHardDelete = (id: number) => {
    requestConfirm("Permanent Deletion", "Are you sure you want to permanently delete this project? This action cannot be undone.",
      () => {
        axios.delete(`http://127.0.0.1:8000/api/applications/${id}/`)
          .then(() => { fetchApplications(); showNotification("Project successfully deleted.", "success"); })
          .catch(() => showNotification("Failed to delete project.", "error"));
      }, "Delete Forever", "bg-red-600 hover:bg-red-700"
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800 relative">
      
      {/* Toast Notification & Confirm Dialog... */}
      {toast.show && (
        <div className={`fixed bottom-8 right-8 z-[100] px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 transition-all transform animate-in slide-in-from-bottom-5 text-white font-medium text-sm
          ${toast.type === 'success' ? 'bg-green-600' : toast.type === 'error' ? 'bg-red-600' : 'bg-blue-600'}
        `}>{toast.message}</div>
      )}

      {confirmDialog.show && (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center p-4 z-[70]">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm flex flex-col overflow-hidden">
            <div className="p-6 text-center">
              <h3 className="text-xl font-bold text-slate-800 mb-2">{confirmDialog.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{confirmDialog.message}</p>
            </div>
            <div className="px-6 py-4 bg-slate-50 flex justify-end gap-3 border-t border-slate-100">
              <button onClick={() => setConfirmDialog({ ...confirmDialog, show: false })} className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg font-medium text-sm transition-colors">Cancel</button>
              <button onClick={() => { confirmDialog.action?.(); setConfirmDialog({ ...confirmDialog, show: false }); }} className={`px-4 py-2 text-white rounded-lg font-medium text-sm transition-colors ${confirmDialog.confirmColor}`}>{confirmDialog.confirmText}</button>
            </div>
          </div>
        </div>
      )}

      {/* --- SIDEBAR NAVIGATION --- */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col fixed h-full shadow-md z-40">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg shadow-sm">
            <BuildingIcon />
          </div>
          <h2 className="text-xl font-bold text-white tracking-wide">DHSUD Tracker</h2>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-6">
          <button onClick={() => setCurrentView('dashboard')} className={`w-full text-left px-4 py-3 rounded-lg transition-colors text-sm font-medium ${currentView === 'dashboard' ? 'bg-blue-600 text-white shadow-sm' : 'hover:bg-slate-800'}`}>
            Dashboard
          </button>
          <button onClick={() => setCurrentView('active')} className={`w-full text-left px-4 py-3 rounded-lg transition-colors text-sm font-medium ${currentView === 'active' ? 'bg-blue-600 text-white shadow-sm' : 'hover:bg-slate-800'}`}>
            Active Projects
          </button>
          <button onClick={() => setCurrentView('archive')} className={`w-full text-left px-4 py-3 rounded-lg transition-colors text-sm font-medium ${currentView === 'archive' ? 'bg-blue-600 text-white shadow-sm' : 'hover:bg-slate-800'}`}>
            Archives
          </button>
        </nav>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 p-8 ml-64 overflow-y-auto">
        <div className="max-w-6xl mx-auto">

          {/* DASHBOARD VIEW */}
          {currentView === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800">System Dashboard</h1>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 border-l-4 border-l-blue-500">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Ongoing</p>
                  <p className="text-3xl font-bold text-slate-800">{stats.ongoing}</p>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 border-l-4 border-l-emerald-500">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Approved</p>
                  <p className="text-3xl font-bold text-slate-800">{stats.approved}</p>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 border-l-4 border-l-amber-500">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Endorsed to HREDRB</p>
                  <p className="text-3xl font-bold text-slate-800">{stats.endorsed}</p>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 border-l-4 border-l-red-500">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Denied</p>
                  <p className="text-3xl font-bold text-slate-800">{stats.denied}</p>
                </div>
              </div>

              {/* Chart Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-800 mb-6">Application Status Breakdown</h3>
                  {isLoading ? (
                    <div className="h-72 flex items-center justify-center">
                      <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <div className="h-72 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                          <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                          <Tooltip 
                            cursor={{ fill: '#f1f5f9' }} 
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                          />
                          <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={60}>
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-800 mb-6">Projects by Type</h3>
                  {isLoading ? (
                    <div className="h-72 flex items-center justify-center">
                      <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
                    </div>
                  ) : pieChartData.length === 0 ? (
                    <div className="h-72 flex items-center justify-center text-slate-400 text-sm">
                      No project data available yet.
                    </div>
                  ) : (
                    <div className="h-72 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieChartData}
                            cx="50%"
                            cy="45%"
                            innerRadius={70}
                            outerRadius={100}
                            paddingAngle={3}
                            dataKey="value"
                            stroke="none"
                          >
                            {pieChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            formatter={(value: any, name: any) => [`${value} Project${value > 1 ? 's' : ''}`, name]}
                          />
                          <Legend verticalAlign="bottom" height={36} iconType="circle" formatter={(value) => <span className="text-slate-600 font-medium">{value}</span>} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TABLE VIEWS (Active & Archive) */}
          {(currentView === 'active' || currentView === 'archive') && (
            <div className="animate-in fade-in duration-300">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-slate-800">{currentView === 'active' ? 'Project Registry' : 'Archived Records'}</h1>
                </div>
                
                <div className="flex items-center gap-3">
                  {/* ✅ ADDED: Select Multiple Toggle Button */}
                  <button 
                    onClick={() => {
                      setIsBulkMode(!isBulkMode);
                      if (isBulkMode) setSelectedIds([]);
                    }} 
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm border ${
                      isBulkMode 
                        ? 'bg-slate-700 hover:bg-slate-800 text-white border-slate-700' 
                        : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
                    }`}
                  >
                    {isBulkMode ? 'Cancel Selection' : 'Select Multiple'}
                  </button>

                  {currentView === 'active' && (
                    <>
                      <label className="cursor-pointer bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm">
                        Import CSV
                        <input type="file" className="hidden" accept=".xlsx, .csv" onChange={handleImport} />
                      </label>
                      <button onClick={handleExport} className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm">
                        Export Data
                      </button>
                      <button onClick={() => handleOpenModal(null)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm">
                        + Add New Project
                      </button>
                    </>
                  )}
                </div>
              </div>

              {selectedIds.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 flex justify-between items-center animate-in slide-in-from-top-2">
                  <span className="text-blue-800 font-medium text-sm px-2">
                    {selectedIds.length} project{selectedIds.length > 1 ? 's' : ''} selected
                  </span>
                  <div className="flex gap-2">
                    {currentView === 'active' && (
                      <button onClick={() => handleBulkAction('archive')} className="px-4 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-md text-sm font-medium transition-colors">
                        Archive Selected
                      </button>
                    )}
                    {currentView === 'archive' && (
                      <>
                        <button onClick={() => handleBulkAction('restore')} className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-sm font-medium transition-colors">
                          Restore Selected
                        </button>
                        <button onClick={() => handleBulkAction('delete')} className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium transition-colors">
                          Delete Selected
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-3 mb-4">
                <input 
                  type="text"
                  placeholder="Search projects or locations..."
                  className="flex-1 px-4 py-2 rounded-lg border border-slate-300 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select 
                  className="px-4 py-2 rounded-lg border border-slate-300 bg-white focus:border-blue-500 outline-none text-sm text-slate-700 min-w-[160px]"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="All">All Statuses</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Approved">Approved</option>
                  <option value="Denied">Denied</option>
                  <option value="Endorsed to HREDRB">Endorsed to HREDRB</option>
                </select>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left border-collapse table-fixed">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      {/* ✅ UPDATED: Master Checkbox conditionally rendered */}
                      {isBulkMode && (
                        <th className="px-6 py-3 w-[5%]">
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                            checked={filteredApps.length > 0 && selectedIds.length === filteredApps.length}
                            onChange={handleSelectAll}
                          />
                        </th>
                      )}
                      <th className="px-2 py-3 text-sm font-semibold text-slate-600 w-[30%]">Project Details</th>
                      <th className="px-2 py-3 text-sm font-semibold text-slate-600 w-[20%]">Location</th>
                      <th className="px-2 py-3 text-sm font-semibold text-slate-600 w-[15%]">Status</th>
                      <th className="px-2 py-3 text-sm font-semibold text-slate-600 w-[15%]">Certificates</th>
                      <th className="px-6 py-3 text-sm font-semibold text-slate-600 w-[15%] text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {isLoading ? (
                      <tr>
                        {/* ✅ UPDATED: Dynamic colSpan */}
                        <td colSpan={isBulkMode ? 6 : 5} className="px-6 py-16 text-center">
                          <div className="flex flex-col items-center justify-center space-y-3">
                            <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
                            <p className="text-slate-500 text-sm font-medium animate-pulse">Fetching records...</p>
                          </div>
                        </td>
                      </tr>
                    ) : filteredApps.length === 0 ? (
                      <tr>
                        {/* ✅ UPDATED: Dynamic colSpan */}
                        <td colSpan={isBulkMode ? 6 : 5} className="px-6 py-8 text-center text-slate-500 text-sm">
                          No matching records found.
                        </td>
                      </tr>
                    ) : (
                      filteredApps.map((app) => (
                        <tr key={app.id} className={`hover:bg-slate-50 transition-colors ${selectedIds.includes(app.id) ? 'bg-blue-50/50' : ''}`}>
                          {/* ✅ UPDATED: Individual Row Checkbox conditionally rendered */}
                          {isBulkMode && (
                            <td className="px-6 py-4">
                              <input 
                                type="checkbox" 
                                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                                checked={selectedIds.includes(app.id)}
                                onChange={() => handleSelectRow(app.id)}
                              />
                            </td>
                          )}
                          <td className="px-2 py-4">
                            <div className="font-semibold text-slate-800 text-base">{app.name_of_proj}</div>
                            <div className="text-sm text-slate-500 mt-0.5">{app.proj_type} • {app.type_of_application}</div>
                            {app.crls_options && app.crls_options.length > 0 && (
                              <div className="text-xs text-blue-600 mt-1">{app.crls_options.join(', ')}</div>
                            )}
                          </td>
                          <td className="px-2 py-4">
                            <div className="text-sm font-medium text-slate-700">{app.mun_city}</div>
                            <div className="text-sm text-slate-500">{app.prov}</div>
                          </td>
                          <td className="px-2 py-4">
                            <div className="flex items-center gap-2 whitespace-nowrap">
                              <span className={`w-2 h-2 rounded-full shrink-0 ${
                                app.status_of_application === 'Archived' ? 'bg-slate-400' : 
                                app.status_of_application === 'Approved' ? 'bg-emerald-500' :
                                app.status_of_application === 'Denied' ? 'bg-red-500' :
                                app.status_of_application === 'Endorsed to HREDRB' ? 'bg-amber-500' :
                                'bg-blue-500'
                              }`}></span>
                              <span className="text-sm font-medium text-slate-700">
                                {app.status_of_application}
                              </span>
                            </div>
                          </td>
                          <td className="px-2 py-4 text-slate-600 text-sm font-mono">
                            CR: {app.cr_no || '-'}<br/>LS: {app.ls_no || '-'}
                          </td>
                          
                          <td className="px-6 py-4 text-right space-x-2">
                            {currentView === 'active' ? (
                              <>
                                <button title="Edit Project" onClick={() => handleOpenModal(app)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors inline-flex"><EditIcon /></button>
                                <button title="Archive Project" onClick={() => handleSoftDelete(app.id)} className="p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors inline-flex"><ArchiveIcon /></button>
                              </>
                            ) : (
                              <>
                                <button title="Restore Project" onClick={() => handleRestore(app.id)} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors inline-flex"><RestoreIcon /></button>
                                <button title="Delete Forever" onClick={() => handleHardDelete(app.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors inline-flex"><TrashIcon /></button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Form Entry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800">{editingId ? 'Edit Project' : 'Add New Project'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-2xl">&times;</button>
            </div>
            
            <div className="overflow-y-auto p-6">
              <form id="app-form" onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-slate-800 mb-4 border-b border-slate-100 pb-2">Project Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="col-span-1 md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Project Name *</label>
                      <input required type="text" className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" value={formData.name_of_proj} onChange={e => setFormData({...formData, name_of_proj: e.target.value})} />
                    </div>

                    <div className="col-span-1">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Owner / Developer</label>
                      <input type="text" className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" value={formData.proj_owner_dev} onChange={e => setFormData({...formData, proj_owner_dev: e.target.value})} />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Project Type</label>
                      <select className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" value={formData.proj_type} onChange={e => setFormData({...formData, proj_type: e.target.value})}>
                        <option value="" disabled>Select Type...</option>
                        {projTypeOptionsList.map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Application Type</label>
                      <select className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" value={formData.type_of_application} onChange={e => setFormData({...formData, type_of_application: e.target.value})}>
                        <option value="New Application">New Application</option>
                        <option value="Reactivated">Reactivated</option>
                        <option value="Replacement">Replacement</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Current Status</label>
                      <select className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" value={formData.status_of_application} onChange={e => setFormData({...formData, status_of_application: e.target.value})}>
                        <option value="Ongoing">Ongoing</option>
                        <option value="Approved">Approved</option>
                        <option value="Denied">Denied</option>
                        <option value="Endorsed to HREDRB">Endorsed to HREDRB</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-slate-800 mb-4 border-b border-slate-100 pb-2">
                    New or Amended CRLS <span className="text-xs font-normal text-slate-500">(Can choose many)</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {crlsOptionsList.map((option) => (
                      <label key={option} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                          value={option}
                          checked={formData.crls_options?.includes(option) || false}
                          onChange={(e) => {
                            const isChecked = e.target.checked;
                            setFormData(prev => ({
                              ...prev,
                              crls_options: isChecked 
                                ? [...(prev.crls_options || []), option]
                                : (prev.crls_options || []).filter(item => item !== option)
                            }));
                          }}
                        />
                        <span className="text-slate-700 text-sm">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-slate-800 mb-4 border-b border-slate-100 pb-2">Location</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Street / Barangay</label>
                      <input type="text" className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" value={formData.street_brgy} onChange={e => setFormData({...formData, street_brgy: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Municipality / City</label>
                      <input type="text" className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" value={formData.mun_city} onChange={e => setFormData({...formData, mun_city: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Province</label>
                      <input type="text" className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" value={formData.prov} onChange={e => setFormData({...formData, prov: e.target.value})} />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-slate-800 mb-4 border-b border-slate-100 pb-2">Dates</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Date Filed</label>
                      <input type="date" className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" value={formData.date_filed || ''} onChange={e => setFormData({...formData, date_filed: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Date Issued</label>
                      <input type="date" className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" value={formData.date_issued || ''} onChange={e => setFormData({...formData, date_issued: e.target.value})} />
                    </div>
                  </div>
                </div>
              </form>
            </div>
            
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 rounded-b-xl">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-700 hover:bg-slate-200 rounded-lg font-medium text-sm transition-colors">Cancel</button>
              <button type="submit" form="app-form" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors">
                {editingId ? 'Save Changes' : 'Create Project'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}