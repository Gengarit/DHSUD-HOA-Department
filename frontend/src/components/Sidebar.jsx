import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  AlertTriangle,
  ClipboardX,
  Stamp,
  FileQuestion,
  CheckCircle2,
  Settings
} from 'lucide-react';

function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/hoa-management', label: 'HOA Management', icon: FileText },
  ];

  const legalWorkflowItems = [
    { path: '/notice-of-violation', label: 'Notice of Violation', icon: AlertTriangle },
    { path: '/order-of-termination', label: 'Order of Termination', icon: ClipboardX },
    { path: '/order-of-imposition', label: 'Order of Imposition', icon: Stamp },
  ];

  const otherItems = [
    { path: '/motion-for-reconsideration', label: 'Motion for Reconsideration', icon: FileQuestion },
    { path: '/compliance-status', label: 'Compliance Status', icon: CheckCircle2 },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-[195px] bg-[#2D3A52] h-screen flex flex-col border-r border-[#3A4A62] overflow-hidden">
      {/* Logo Section */}
      <div className="p-6 border-b border-[#3A4A62]">
        <div className="text-white text-lg font-semibold">
          <div>HOA Registry</div>
          <div className="text-xs text-[#9CA3AF] font-normal">Monitoring System</div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {/* Main Menu */}
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm ${
                active
                  ? 'bg-[#6366F1] text-white shadow-lg'
                  : 'text-[#D1D5DB] hover:bg-[#3A4A62] hover:text-white'
              }`}
            >
              <Icon size={18} />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}

        {/* Legal Workflow Section */}
        <div className="pt-2">
          <div className="px-4 py-2 text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">
            Legal Workflow
          </div>
          {legalWorkflowItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm ${
                  active
                    ? 'bg-[#6366F1] text-white shadow-lg'
                    : 'text-[#D1D5DB] hover:bg-[#3A4A62] hover:text-white'
                }`}
              >
                <Icon size={18} />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Other Items */}
        {otherItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm ${
                active
                  ? 'bg-[#6366F1] text-white shadow-lg'
                  : 'text-[#D1D5DB] hover:bg-[#3A4A62] hover:text-white'
              }`}
            >
              <Icon size={18} />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Settings at Bottom */}
      <div className="border-t border-[#3A4A62] p-4">
        <Link
          to="/settings"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm ${
            isActive('/settings')
              ? 'bg-[#6366F1] text-white shadow-lg'
              : 'text-[#D1D5DB] hover:bg-[#3A4A62] hover:text-white'
          }`}
        >
          <Settings size={18} />
          <span>Settings</span>
        </Link>
      </div>

      {/* Footer */}
      <div className="border-t border-[#3A4A62] p-3 text-xs text-[#6B7280]">
        <div className="text-center">Government HOA Registration</div>
        <div className="text-center">Monitoring System v1.0</div>
      </div>
    </div>
  );
}

export default Sidebar;
