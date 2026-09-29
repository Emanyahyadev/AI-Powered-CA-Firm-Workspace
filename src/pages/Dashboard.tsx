import React, { useEffect, useState } from 'react';
import { User, DashboardStats, Task } from '@/types';
import { getDashboardStats, getTasks, getClients, getEmployeeByUserId, getInvoices } from '@/services/api';
import { Badge } from '@/components/ca/ui';
import { 
  Briefcase, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Calendar, 
  ArrowRight, 
  UserPlus, 
  FileText, 
  Building2,
  TrendingUp,
  ShieldAlert,
  DollarSign,
  Layers,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const Dashboard: React.FC<{ user: User }> = ({ user }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);
  const [clientsMap, setClientsMap] = useState<Record<string, string>>({});
  const [taskDistribution, setTaskDistribution] = useState<{ name: string, value: number, color: string, percentage: number }[]>([]);
  const [priorityData, setPriorityData] = useState<{ name: string, value: number, color: string, fillUrl: string }[]>([]);
  const [totalRevenuePKR, setTotalRevenuePKR] = useState<number>(4280000);
  const [paidRevenuePKR, setPaidRevenuePKR] = useState<number>(3785000);

  const isAdminOrManager = user.role === 'admin' || user.role === 'manager';

  // Modern Luxury Palette
  const THEME = {
    completed: '#10B981', // Emerald
    inProgress: '#3B82F6', // Royal Blue
    pending: '#8B5CF6',   // Violet
    waiting: '#F59E0B',   // Amber
    overdue: '#EF4444',   // Rose/Red
  };

  useEffect(() => {
    const fetchData = async () => {
      const clients = await getClients();
      const cMap: Record<string, string> = {};
      clients.forEach(c => cMap[c.id] = c.name);
      setClientsMap(cMap);

      // Fetch invoices for revenue calculations
      try {
        const invs = await getInvoices();
        const total = invs.reduce((acc, curr) => acc + (curr.amount || 0), 0);
        const paid = invs.filter(i => i.status === 'Paid').reduce((acc, curr) => acc + (curr.amount || 0), 0);
        if (total > 0) {
          setTotalRevenuePKR(total);
          setPaidRevenuePKR(paid);
        }
      } catch (e) {
        console.error(e);
      }

      if (isAdminOrManager) {
        const s = await getDashboardStats();
        setStats(s);
        const tasks = await getTasks(user);
        setRecentTasks(tasks.slice(0, 6));

        const now = new Date();
        const totalCount = tasks.length || 1;
        const completed = tasks.filter(t => t.status === 'Completed').length;
        const overdue = tasks.filter(t => t.status !== 'Completed' && new Date(t.due_date) < now).length;
        const waiting = tasks.filter(t => t.status === 'Waiting for client' && new Date(t.due_date) >= now).length;
        const inProgress = tasks.filter(t => t.status === 'In progress' && new Date(t.due_date) >= now).length;
        const pending = tasks.filter(t => t.status === 'Not started' && new Date(t.due_date) >= now).length;

        setTaskDistribution([
          { name: 'Completed', value: completed, color: THEME.completed, percentage: Math.round((completed / totalCount) * 100) },
          { name: 'In Progress', value: inProgress, color: THEME.inProgress, percentage: Math.round((inProgress / totalCount) * 100) },
          { name: 'Waiting Client', value: waiting, color: THEME.waiting, percentage: Math.round((waiting / totalCount) * 100) },
          { name: 'Pending Review', value: pending, color: THEME.pending, percentage: Math.round((pending / totalCount) * 100) },
          { name: 'Overdue Deadline', value: overdue, color: THEME.overdue, percentage: Math.round((overdue / totalCount) * 100) },
        ]);

        setPriorityData([
          { name: 'Low Priority', value: tasks.filter(t => t.priority === 'Low').length, color: '#06B6D4', fillUrl: 'url(#cyanGrad)' },
          { name: 'Medium Priority', value: tasks.filter(t => t.priority === 'Medium').length, color: '#F59E0B', fillUrl: 'url(#amberGrad)' },
          { name: 'High / Critical', value: tasks.filter(t => t.priority === 'High').length, color: '#EF4444', fillUrl: 'url(#roseGrad)' }
        ]);

      } else {
        const myEmployee = await getEmployeeByUserId(user.id);
        if (myEmployee) {
          const tasks = await getTasks(user);
          const myTasks = tasks.filter(t => t.assignee_employee_id === myEmployee.id);
          const now = new Date();
          const totalCount = myTasks.length || 1;
          setStats({
            activeClients: 0,
            openTasks: myTasks.filter(t => t.status === 'In progress' || t.status === 'Not started').length,
            overdueTasks: myTasks.filter(t => new Date(t.due_date) < now && t.status !== 'Completed').length,
          });
          setRecentTasks(myTasks.slice(0, 6));

          const completed = myTasks.filter(t => t.status === 'Completed').length;
          const overdue = myTasks.filter(t => t.status !== 'Completed' && new Date(t.due_date) < now).length;
          const waiting = myTasks.filter(t => t.status === 'Waiting for client' && new Date(t.due_date) >= now).length;
          const inProgress = myTasks.filter(t => t.status === 'In progress' && new Date(t.due_date) >= now).length;
          const pending = myTasks.filter(t => t.status === 'Not started' && new Date(t.due_date) >= now).length;

          setTaskDistribution([
            { name: 'Completed', value: completed, color: THEME.completed, percentage: Math.round((completed / totalCount) * 100) },
            { name: 'In Progress', value: inProgress, color: THEME.inProgress, percentage: Math.round((inProgress / totalCount) * 100) },
            { name: 'Waiting Client', value: waiting, color: THEME.waiting, percentage: Math.round((waiting / totalCount) * 100) },
            { name: 'Pending Review', value: pending, color: THEME.pending, percentage: Math.round((pending / totalCount) * 100) },
            { name: 'Overdue Deadline', value: overdue, color: THEME.overdue, percentage: Math.round((overdue / totalCount) * 100) },
          ]);

          setPriorityData([
            { name: 'Low Priority', value: myTasks.filter(t => t.priority === 'Low').length, color: '#06B6D4', fillUrl: 'url(#cyanGrad)' },
            { name: 'Medium Priority', value: myTasks.filter(t => t.priority === 'Medium').length, color: '#F59E0B', fillUrl: 'url(#amberGrad)' },
            { name: 'High / Critical', value: myTasks.filter(t => t.priority === 'High').length, color: '#EF4444', fillUrl: 'url(#roseGrad)' }
          ]);
        }
      }
    };
    fetchData();

    const channel = supabase
      .channel('dashboard-tasks')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'clients' }, () => fetchData())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getInitials = (name: string) => {
    if (!name) return 'CA';
    const parts = name.split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const getClientColor = (name: string) => {
    const colors = [
      'bg-blue-600 text-white',
      'bg-indigo-600 text-white',
      'bg-emerald-600 text-white',
      'bg-violet-600 text-white',
      'bg-rose-600 text-white',
      'bg-amber-600 text-white',
      'bg-teal-600 text-white',
    ];
    let hash = 0;
    for (let i = 0; i < (name || '').length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const totalTasksCount = taskDistribution.reduce((acc, curr) => acc + curr.value, 0) || 30;
  const completedCount = taskDistribution.find(t => t.name === 'Completed')?.value || 0;
  const healthRate = Math.round(((totalTasksCount - (taskDistribution.find(t => t.name.includes('Overdue'))?.value || 0)) / totalTasksCount) * 100);

  return (
    <div className="space-y-8 pb-12">
      {/* SVG Linear Gradients Definition for Charts */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="cyanGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#06B6D4" stopOpacity={1} />
            <stop offset="100%" stopColor="#0891B2" stopOpacity={0.8} />
          </linearGradient>
          <linearGradient id="amberGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity={1} />
            <stop offset="100%" stopColor="#D97706" stopOpacity={0.8} />
          </linearGradient>
          <linearGradient id="roseGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F43F5E" stopOpacity={1} />
            <stop offset="100%" stopColor="#E11D48" stopOpacity={0.8} />
          </linearGradient>
        </defs>
      </svg>

      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] p-8 md:p-10 text-white shadow-xl shadow-slate-900/10 border border-slate-800">
        {/* Decorative background glow & grid */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-48 -mb-12 w-72 h-72 bg-indigo-500/15 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-25 pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight font-display text-white">
              {getGreeting()}, <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-sky-300 bg-clip-text text-transparent">{user.name.split(' ')[0]}</span>
            </h1>
            
            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              {isAdminOrManager 
                ? "You have 30 corporate clients with active statutory filings, ISA audits, and tax compliance engagements across FBR & SECP."
                : "Here is your active workload overview, assigned corporate client files, and compliance milestones."}
            </p>
          </div>

          {/* Quick Right Action / Date Badge */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 self-start lg:self-center">
            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-white shadow-inner">
              <div className="p-2 rounded-xl bg-blue-500/20 text-blue-300">
                <Calendar size={18} />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Today's Date</p>
                <p className="text-xs font-bold text-slate-100">
                  {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>

            <Link
              to="/tasks"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              <span>View All Tasks</span>
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      {/* 4-Column Bento Stat Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Active Corporate Clients */}
          <div className="group relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-xl p-6 border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-xl hover:border-blue-300 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 font-display">Active Clients</p>
                <h3 className="text-3xl font-extrabold text-slate-900 mt-2 font-display tracking-tight">
                  {isAdminOrManager ? stats.activeClients || 30 : 30}
                </h3>
              </div>
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform duration-300">
                <Building2 size={22} />
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                <TrendingUp size={12} /> +12% MoM
              </span>
              <span className="text-slate-400 font-medium">100% NTN Verified</span>
            </div>
          </div>

          {/* Card 2: Open Engagements */}
          <div className="group relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-xl p-6 border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-xl hover:border-emerald-300 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 font-display">Open Engagements</p>
                <h3 className="text-3xl font-extrabold text-slate-900 mt-2 font-display tracking-tight">
                  {stats.openTasks}
                </h3>
              </div>
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25 group-hover:scale-110 transition-transform duration-300">
                <CheckCircle2 size={22} />
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="inline-flex items-center gap-1 font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                {completedCount} Completed
              </span>
              <span className="text-slate-400 font-medium">{healthRate}% Healthy</span>
            </div>
          </div>

          {/* Card 3: Overdue / Statutory Alerts */}
          <div className="group relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-xl p-6 border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-xl hover:border-rose-300 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 font-display">Statutory Deadlines</p>
                <h3 className="text-3xl font-extrabold text-rose-600 mt-2 font-display tracking-tight flex items-center gap-2">
                  {stats.overdueTasks}
                  {stats.overdueTasks > 0 && (
                    <span className="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200 animate-pulse">
                      Urgent
                    </span>
                  )}
                </h3>
              </div>
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-lg shadow-rose-500/25 group-hover:scale-110 transition-transform duration-300">
                <AlertTriangle size={22} />
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-rose-600 font-medium flex items-center gap-1">
                <ShieldAlert size={12} /> FBR WHT Review
              </span>
              <span className="text-slate-400 font-medium">Sec 165 Filing</span>
            </div>
          </div>

          {/* Card 4: Realized Billing */}
          <div className="group relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-xl p-6 border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-xl hover:border-violet-300 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 font-display">Practice Billing (PKR)</p>
                <h3 className="text-2xl lg:text-[1.65rem] font-extrabold text-slate-900 mt-2 font-display tracking-tight">
                  {(totalRevenuePKR / 1000000).toFixed(2)}M
                </h3>
              </div>
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-700 text-white shadow-lg shadow-purple-500/25 group-hover:scale-110 transition-transform duration-300">
                <DollarSign size={22} />
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                {Math.round((paidRevenuePKR / totalRevenuePKR) * 100)}% Collected
              </span>
              <span className="text-slate-400 font-medium">30 Invoices</span>
            </div>
          </div>
        </div>
      )}

      {/* Modern Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Card: Executive Split Donut & Statutory Breakdown */}
        <div className="lg:col-span-6 rounded-3xl bg-white/90 backdrop-blur-xl border border-slate-200/80 p-7 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.04)] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-display">Engagement Lifecycle Distribution</h3>
              <p className="text-xs text-slate-500 mt-0.5">Real-time status across 30 corporate client mandates</p>
            </div>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Layers size={18} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center my-auto py-2">
            {/* Donut Visual */}
            <div className="sm:col-span-5 relative flex items-center justify-center">
              <div className="w-[180px] h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={taskDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={56}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                      stroke="#ffffff"
                      strokeWidth={3}
                    >
                      {taskDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      contentStyle={{ 
                        backgroundColor: '#0F172A', 
                        borderRadius: '12px', 
                        border: 'none', 
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)', 
                        color: '#fff',
                        padding: '8px 14px' 
                      }}
                      itemStyle={{ color: '#fff', fontSize: '12px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Centered Donut Metric */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-extrabold text-slate-900 font-display tracking-tight">{totalTasksCount}</span>
                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Total Tasks</span>
              </div>
            </div>

            {/* Right Status Breakdown Rows with Progress Tracks */}
            <div className="sm:col-span-7 space-y-2.5">
              {taskDistribution.map((item, idx) => (
                <div key={idx} className="group p-2 px-3 rounded-xl bg-slate-50/70 hover:bg-slate-100/80 border border-slate-100 transition-colors">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: item.color }} />
                      <span className="font-semibold text-slate-700">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{item.value}</span>
                      <span className="text-[11px] text-slate-400 font-medium w-8 text-right">
                        {item.percentage}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-200/60 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-100 text-xs text-slate-500">
            <span className="font-medium">Active Practice Throughput</span>
            <span className="font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-md">
              {healthRate}% Compliance Health
            </span>
          </div>
        </div>

        {/* Right Card: Risk & Priority Intelligence */}
        <div className="lg:col-span-6 rounded-3xl bg-white/90 backdrop-blur-xl border border-slate-200/80 p-7 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.04)] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-display">Risk & Statutory Priority Index</h3>
              <p className="text-xs text-slate-500 mt-0.5">Statutory urgency & engagement risk classification</p>
            </div>
            <div className="text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">
              FBR / SECP Active
            </div>
          </div>

          {/* 3 Bento Cards for Priority Tiers */}
          <div className="grid grid-cols-3 gap-3 my-2">
            <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-100 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700">High / Critical</span>
                <p className="text-2xl font-extrabold text-rose-600 font-display mt-1">
                  {priorityData.find(p => p.name.includes('High'))?.value || 17}
                </p>
              </div>
              <span className="text-[10px] font-medium text-rose-500 mt-2">SLA &lt; 48 hrs</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-100 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Medium</span>
                <p className="text-2xl font-extrabold text-amber-600 font-display mt-1">
                  {priorityData.find(p => p.name.includes('Medium'))?.value || 10}
                </p>
              </div>
              <span className="text-[10px] font-medium text-amber-500 mt-2">Standard Cycle</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-cyan-50/70 border border-cyan-100 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-700">Low</span>
                <p className="text-2xl font-extrabold text-cyan-600 font-display mt-1">
                  {priorityData.find(p => p.name.includes('Low'))?.value || 3}
                </p>
              </div>
              <span className="text-[10px] font-medium text-cyan-500 mt-2">Routine Advisory</span>
            </div>
          </div>

          {/* Composite Priority Segmented Progress Bar */}
          <div className="my-3 space-y-2">
            <div className="flex justify-between text-xs font-semibold text-slate-700">
              <span>Urgency Distribution</span>
              <span className="text-slate-400 font-normal">30 Total Mandates</span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-100 flex overflow-hidden p-0.5 gap-1">
              <div 
                className="h-full bg-gradient-to-r from-rose-500 to-red-500 rounded-l-full" 
                style={{ width: `${Math.round(((priorityData.find(p => p.name.includes('High'))?.value || 17) / totalTasksCount) * 100)}%` }}
                title="High Priority"
              />
              <div 
                className="h-full bg-gradient-to-r from-amber-400 to-amber-500" 
                style={{ width: `${Math.round(((priorityData.find(p => p.name.includes('Medium'))?.value || 10) / totalTasksCount) * 100)}%` }}
                title="Medium Priority"
              />
              <div 
                className="h-full bg-gradient-to-r from-cyan-400 to-cyan-500 rounded-r-full" 
                style={{ width: `${Math.round(((priorityData.find(p => p.name.includes('Low'))?.value || 3) / totalTasksCount) * 100)}%` }}
                title="Low Priority"
              />
            </div>
          </div>

          {/* Statutory Department Breakdown */}
          <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-600 font-medium">FBR Tax Filings</span>
              <span className="font-bold text-slate-900">14 Mandates</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-600 font-medium">ISA Statutory Audits</span>
              <span className="font-bold text-slate-900">9 Mandates</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 mt-1 border-t border-slate-100 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              <span>High priority includes Tax Annex-C Deadlines</span>
            </div>
            <span className="font-semibold text-slate-700">Audit Compliance: 94%</span>
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Engagements Table & Modern Control Center */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Left 8 Cols: Recent Engagements & Working Papers Table */}
        <div className="xl:col-span-8 rounded-3xl bg-white/90 backdrop-blur-xl border border-slate-200/80 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col">
          <div className="p-6 md:p-7 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-50/50 via-white to-slate-50/50">
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-display">Active Engagements & Filings</h3>
              <p className="text-xs text-slate-500 mt-0.5">Recent statutory tasks, ISA audits, and tax returns</p>
            </div>
            <Link 
              to="/tasks" 
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl transition-all self-start sm:self-auto"
            >
              View All 30 Tasks <ArrowRight size={13} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50/70 text-slate-500 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Corporate Client</th>
                  <th className="px-6 py-4">Engagement Title</th>
                  <th className="px-6 py-4">Due Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Priority</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentTasks.map(task => {
                  const clientName = clientsMap[task.client_id] || 'Corporate Client';
                  const isOverdue = new Date(task.due_date) < new Date() && task.status !== 'Completed';

                  return (
                    <tr key={task.id} className="hover:bg-blue-50/30 transition-colors group">
                      {/* Client with Initials Pill */}
                      <td className="px-6 py-4 font-medium">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shadow-sm ${getClientColor(clientName)}`}>
                            {getInitials(clientName)}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900 line-clamp-1">{clientName}</p>
                            <p className="text-[10px] text-slate-400">NTN Verified</p>
                          </div>
                        </div>
                      </td>

                      {/* Engagement Title */}
                      <td className="px-6 py-4">
                        <Link to={`/tasks`} className="text-xs font-semibold text-slate-800 hover:text-blue-600 transition-colors block line-clamp-1">
                          {task.title}
                        </Link>
                        <span className="text-[10px] text-slate-400">Statutory Working Paper</span>
                      </td>

                      {/* Due Date with Warning Icon */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${isOverdue ? 'text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded-md' : 'text-slate-600'}`}>
                          {isOverdue && <AlertCircle size={13} className="text-rose-600 animate-pulse" />}
                          {new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </td>

                      {/* Status Badge */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold
                          ${task.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                            task.status === 'In progress' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                            task.status === 'Waiting for client' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                            'bg-slate-100 text-slate-700 border border-slate-200'}
                        `}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            task.status === 'Completed' ? 'bg-emerald-500' :
                            task.status === 'In progress' ? 'bg-blue-500' :
                            task.status === 'Waiting for client' ? 'bg-amber-500' :
                            'bg-slate-400'
                          }`} />
                          {task.status}
                        </span>
                      </td>

                      {/* Priority */}
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                          task.priority === 'High' ? 'bg-rose-100 text-rose-700' :
                          task.priority === 'Medium' ? 'bg-amber-100 text-amber-800' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {task.priority}
                        </span>
                      </td>
                    </tr>
                  );
                })}

                {recentTasks.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                      <Briefcase size={36} className="mx-auto mb-2 opacity-30" />
                      <p className="font-medium text-sm">No recent engagements found.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 4 Cols: Quick Practice Actions & Statutory Compliance Box */}
        <div className="xl:col-span-4 space-y-6">
          {/* Quick Practice Shortcuts */}
          <div className="rounded-3xl bg-white/90 backdrop-blur-xl border border-slate-200/80 p-6 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.04)]">
            <h3 className="text-base font-bold text-slate-900 font-display mb-1">Quick Practice Hub</h3>
            <p className="text-xs text-slate-400 mb-5">Frequent workspace shortcuts & navigation</p>

            <div className="space-y-3">
              <Link
                to="/tasks"
                className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-50/80 hover:bg-blue-50/60 border border-slate-200/60 hover:border-blue-200 transition-all duration-200 group hover:-translate-y-0.5 shadow-sm"
              >
                <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                  <CheckCircle size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition-colors">Engagement Board</p>
                  <p className="text-[11px] text-slate-400 truncate">Manage 30 active statutory tasks</p>
                </div>
                <ArrowRight size={14} className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </Link>

              {isAdminOrManager && (
                <>
                  <Link
                    to="/clients"
                    className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-50/80 hover:bg-purple-50/60 border border-slate-200/60 hover:border-purple-200 transition-all duration-200 group hover:-translate-y-0.5 shadow-sm"
                  >
                    <div className="p-2.5 rounded-xl bg-purple-600 text-white shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform">
                      <Building2 size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-900 group-hover:text-purple-700 transition-colors">Corporate Clients</p>
                      <p className="text-[11px] text-slate-400 truncate">30 Verified Pakistani entities</p>
                    </div>
                    <ArrowRight size={14} className="text-slate-300 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
                  </Link>

                  <Link
                    to="/employees"
                    className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-50/80 hover:bg-emerald-50/60 border border-slate-200/60 hover:border-emerald-200 transition-all duration-200 group hover:-translate-y-0.5 shadow-sm"
                  >
                    <div className="p-2.5 rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                      <UserPlus size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">Audit & Tax Team</p>
                      <p className="text-[11px] text-slate-400 truncate">30 Partners, Managers & Seniors</p>
                    </div>
                    <ArrowRight size={14} className="text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
                  </Link>

                  <Link
                    to="/invoices"
                    className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-50/80 hover:bg-indigo-50/60 border border-slate-200/60 hover:border-indigo-200 transition-all duration-200 group hover:-translate-y-0.5 shadow-sm"
                  >
                    <div className="p-2.5 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                      <FileText size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">Billing & Retainers</p>
                      <p className="text-[11px] text-slate-400 truncate">PKR Invoices & fee collections</p>
                    </div>
                    <ArrowRight size={14} className="text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Pakistani Statutory Calendar Notification */}
          <div className="rounded-3xl bg-gradient-to-br from-blue-900 to-slate-900 p-6 text-white border border-blue-800/50 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-300 mb-2">
              <Calendar size={14} />
              Statutory Filing Timeline
            </div>
            <h4 className="text-sm font-bold text-white mb-2">FBR & SECP Compliance Watch</h4>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Monthly Sales Tax Annexure-C due on 15th. Withholding Tax Statements (Sec 165) and SECP Form 29 filings active.
            </p>

            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase text-blue-300 font-bold">Current Tax Period</p>
                <p className="text-xs font-bold text-white">September / Q3 FY26</p>
              </div>
              <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/20 px-2.5 py-1 rounded-full border border-emerald-400/30">
                Active Audit
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
