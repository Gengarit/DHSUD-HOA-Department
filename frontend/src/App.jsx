import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import DashboardWithAnalytics from './pages/DashboardWithAnalytics';
import ApplicantRecords from './pages/ApplicantRecords';
import Blacklist from './pages/Blacklist';
import Archive from './pages/Archive';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-background overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar />
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-8">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardWithAnalytics />} />
            <Route path="/applicants" element={<ApplicantRecords />} />
            <Route path="/blacklist" element={<Blacklist />} />
            <Route path="/archive" element={<Archive />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
