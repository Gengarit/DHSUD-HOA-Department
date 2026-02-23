import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import HOAManagement from './pages/HOAManagement';
import NoticeOfViolation from './pages/NoticeOfViolation';
import OrderOfTermination from './pages/OrderOfTermination';
import OrderOfImposition from './pages/OrderOfImposition';
import MotionForReconsideration from './pages/MotionForReconsideration';
import ComplianceStatus from './pages/ComplianceStatus';
import LegalWorkflow from './pages/LegalWorkflow';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-[#1A1F2B] overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar />
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/hoa-management" element={<HOAManagement />} />
            <Route path="/legal-workflow" element={<LegalWorkflow />} />
            <Route path="/notice-of-violation" element={<NoticeOfViolation />} />
            <Route path="/order-of-termination" element={<OrderOfTermination />} />
            <Route path="/order-of-imposition" element={<OrderOfImposition />} />
            <Route path="/motion-for-reconsideration" element={<MotionForReconsideration />} />
            <Route path="/compliance-status" element={<ComplianceStatus />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
