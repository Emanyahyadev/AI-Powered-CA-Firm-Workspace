import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';
import { ChatWidget } from '../chat/ChatWidget';

interface LayoutProps {
  user: User | null;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ user, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen flex bg-[#f8fafc] font-sans text-slate-900 selection:bg-blue-600 selection:text-white relative overflow-x-hidden">
      {/* Background Ambient Glow Orbs for World-Class Executive Look */}
      <div className="fixed top-0 left-0 right-0 h-96 bg-gradient-to-b from-blue-50/60 via-indigo-50/30 to-transparent pointer-events-none z-0" />
      <div className="fixed -top-40 right-0 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="fixed top-80 -left-40 w-[400px] h-[400px] bg-indigo-400/10 rounded-full blur-3xl pointer-events-none z-0" />

      <Sidebar user={user} onLogout={onLogout} isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      {(user?.role === 'admin' || user?.role === 'manager') && <ChatWidget />}

      <div className="flex-1 md:ml-72 flex flex-col min-h-screen relative z-10 transition-all duration-300">
        {/* Mobile Header */}
        <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 md:hidden px-4 py-3.5 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-blue-500/20">
              CA
            </div>
            <div className="font-display font-bold text-slate-900 tracking-tight">CA Firm Workspace</div>
          </div>
          <button 
            onClick={() => setSidebarOpen(true)} 
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            aria-label="Open Navigation"
          >
            <Menu size={20} />
          </button>
        </header>

        {/* Main Content View */}
        <main className="flex-1 p-6 md:p-8 max-w-[1600px] w-full mx-auto animate-in fade-in duration-300">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
