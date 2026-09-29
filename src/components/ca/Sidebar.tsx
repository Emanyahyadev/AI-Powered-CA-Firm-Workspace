import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, CheckSquare, UserCircle, HelpCircle, LogOut, LucideIcon, Receipt, BarChart2, Briefcase, PieChart } from 'lucide-react';
import { User } from '@/types';

interface SidebarProps {
  user: User | null;
  onLogout: () => void;
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, onLogout, isOpen, setIsOpen }) => {
  const isAdmin = user?.role === 'admin';
  const isManager = user?.role === 'manager';
  const isAdminOrManager = isAdmin || isManager;

  const NavItem = ({ to, icon: Icon, label }: { to: string; icon: LucideIcon; label: string }) => (
    <NavLink
      to={to}
      onClick={() => window.innerWidth < 768 && setIsOpen(false)}
      className={({ isActive }) =>
        `group flex items-center gap-3 px-4 py-3 mx-3 rounded-lg transition-all duration-300 relative overflow-hidden ${isActive
          ? 'text-white shadow-lg shadow-blue-500/30'
          : 'text-slate-400 hover:text-white'
        }`
      }
    >
      {({ isActive }) => (
        <>
          {/* Active Background - Static Gradient */}
          <div className={`absolute inset-0 z-0 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600" />
          </div>

          {/* Hover Background - Moving Navy Blue */}
          <div className={`absolute inset-0 z-0 transition-opacity duration-300 ${isActive ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}`}>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-900 to-transparent bg-[length:200%_100%] animate-gradient-x" />
          </div>

          <Icon size={20} className={`relative z-10 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
          <span className="relative z-10 font-medium tracking-wide text-base">{label}</span>
          {isActive && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white/30 rounded-l-full z-10" />}
        </>
      )}
    </NavLink>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-50 h-full w-72 bg-[#020617] text-white transform transition-all duration-300 ease-in-out md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} shadow-2xl border-r border-slate-800`}>
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-blue-900/10 pointer-events-none" />

        {/* Logo Section */}
        <div className="relative p-6 px-7 flex items-center gap-3.5 border-b border-white/5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-700 shadow-lg shadow-blue-500/25 ring-1 ring-white/20 flex items-center justify-center shrink-0">
            <span className="font-display font-extrabold text-base text-white tracking-tight">CA</span>
          </div>
          <div>
            <h1 className="font-display font-extrabold text-xl tracking-tight text-white drop-shadow-sm">
              CA Firm
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">Workspace</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="relative flex-1 py-6 space-y-1.5 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800">
          <div className="px-7 mb-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Overview
          </div>
          <NavItem to="/" icon={LayoutDashboard} label="Dashboard" />

          {isAdminOrManager && (
            <>
              <div className="px-7 mt-8 mb-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Practice Management
              </div>
              <NavItem to="/clients" icon={Users} label="Clients" />
              <NavItem to="/tasks" icon={CheckSquare} label="All Tasks" />
            </>
          )}

          {!isAdminOrManager && <NavItem to="/tasks" icon={CheckSquare} label="My Tasks" />}

          {isAdminOrManager && (
            <>
              <div className="px-7 mt-8 mb-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Team & Finance
              </div>
              <NavItem to="/employees" icon={UserCircle} label="Employees" />
              <NavItem to="/team-progress" icon={BarChart2} label="Analytics" />
              <NavItem to="/invoices" icon={Receipt} label="Invoices" />
            </>
          )}

          <div className="px-7 mt-8 mb-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            System
          </div>
          <NavItem to="/help" icon={HelpCircle} label="Support" />
        </nav>

        {/* User Profile Footer */}
        <div className="relative p-4 border-t border-white/5 bg-slate-900/40">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="relative group cursor-pointer">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 ring-2 ring-transparent group-hover:ring-blue-500/50 transition-all">
                <img
                  src={isAdminOrManager ? "/manager-avatar.png" : `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(user?.name || 'User')}`}
                  alt="Profile"
                  className="w-full h-full object-cover bg-blue-50"
                />
              </div>
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-[#0B1120] rounded-full shadow-sm"></div>
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-sm font-semibold truncate text-white font-display">{user?.name}</p>
              <p className="text-xs text-slate-400 truncate">{user?.role === 'admin' ? 'Administrator' : user?.role === 'manager' ? 'Manager' : 'Team Member'}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-white/5 hover:bg-red-500/80 text-slate-300 hover:text-white rounded-lg transition-all duration-300 text-xs font-semibold uppercase tracking-wider group border border-white/5 hover:border-red-500/50"
          >
            <LogOut size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
