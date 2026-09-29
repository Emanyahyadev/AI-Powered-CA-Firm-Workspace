import React, { useState, useEffect } from 'react';
import { User, Task, Client, Employee } from '@/types';
import { getTasks, getClients, getEmployees, saveTask, getEmployeeByUserId, deleteTask } from '@/services/api';
import { Card, Button, Input, Modal, Label } from '@/components/ca/ui';
import { Search, Plus, Filter, Trash2, Pencil, Download, ChevronDown, CheckCircle2, Clock, AlertTriangle, Building2, UserCircle, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Tasks: React.FC<{ user: User }> = ({ user }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [viewMode, setViewMode] = useState<'all' | 'team' | 'my'>('all');
  const [myEmployeeId, setMyEmployeeId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [newTask, setNewTask] = useState<Partial<Task>>({});
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showAssignees, setShowAssignees] = useState(false);

  const isAdminOrManager = user.role === 'admin' || user.role === 'manager';

  useEffect(() => {
    if (!isAdminOrManager) setViewMode('my');
  }, [isAdminOrManager]);

  useEffect(() => {
    loadData();

    const channel = supabase
      .channel('tasks-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tasks' },
        () => loadData()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const loadData = async () => {
    try {
      const [t, c, e] = await Promise.all([
        getTasks(user),
        getClients(),
        getEmployees()
      ]);

      setTasks(t);

      const myEmp = await getEmployeeByUserId(user.id);
      if (myEmp) {
        setMyEmployeeId(myEmp.id);
      }

      setClients(c);
      setEmployees(e);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title || !newTask.client_id || !newTask.due_date) return;

    setLoading(true);
    try {
      await saveTask({
        ...(editingTaskId && { id: editingTaskId }),
        client_id: newTask.client_id,
        assignee_ids: newTask.assignee_ids,
        assignee_employee_id: newTask.assignee_employee_id || null,
        title: newTask.title,
        description: newTask.description || '',
        status: newTask.status || 'Not started',
        priority: newTask.priority || 'Medium',
        due_date: newTask.due_date
      });
      setIsModalOpen(false);
      setNewTask({});
      setEditingTaskId(null);
      toast({ title: 'Success', description: editingTaskId ? 'Task updated successfully' : 'Task created successfully' });
      loadData();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTaskId(task.id);
    setNewTask({
      title: task.title,
      client_id: task.client_id,
      assignee_ids: task.assignee_ids || (task.assignee_employee_id ? [task.assignee_employee_id] : []),
      priority: task.priority,
      due_date: task.due_date,
      description: task.description,
      status: task.status
    });
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteTask(deleteId);
      toast({ title: 'Success', description: 'Task deleted successfully' });
      loadData();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setDeleteId(null);
    }
  };

  const handleDownloadCSV = () => {
    if (filteredTasks.length === 0) {
      toast({ title: 'Info', description: 'No tasks to download', variant: 'default' });
      return;
    }

    const headers = ['Title', 'Client', 'Assigned To', 'Status', 'Priority', 'Due Date', 'Description'];
    const csvRows = [headers.join(',')];

    filteredTasks.forEach(t => {
      const clientName = getClientName(t.client_id);
      const assigneeName = getEmpNames(t.assignee_ids, t.assignee_employee_id);

      const row = [
        `"${(t.title || '').replace(/"/g, '""')}"`,
        `"${clientName.replace(/"/g, '""')}"`,
        `"${assigneeName.replace(/"/g, '""')}"`,
        t.status,
        t.priority,
        new Date(t.due_date).toLocaleDateString(),
        `"${(t.description || '').replace(/"/g, '""')}"`
      ];
      csvRows.push(row.join(','));
    });

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `tasks_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredTasks = tasks.filter(t => {
    const matchesSearch = (t.title || '').toLowerCase().includes((search || '').toLowerCase());
    const matchesStatus = filter === 'All' || t.status === filter;

    let matchesView = true;
    if (viewMode === 'my') {
      matchesView = (myEmployeeId !== null) && (
        t.assignee_employee_id === myEmployeeId ||
        (t.assignee_ids && t.assignee_ids.includes(myEmployeeId))
      );
    } else if (viewMode === 'team') {
      matchesView = (t.assignee_ids && t.assignee_ids.length > 1);
    }

    if (!isAdminOrManager) {
      const isMine = (myEmployeeId !== null) && (
        t.assignee_employee_id === myEmployeeId ||
        (t.assignee_ids && t.assignee_ids.includes(myEmployeeId))
      );
      if (!isMine) return false;
    }

    return matchesSearch && matchesStatus && matchesView;
  });

  const getClientName = (id: string) => clients.find(c => c.id === id)?.name || 'Corporate Client';
  const getEmpNames = (ids?: string[] | null, singleId?: string | null) => {
    const idList = ids && ids.length > 0 ? ids : (singleId ? [singleId] : []);
    if (idList.length === 0) return 'Unassigned';
    return idList.map(id => employees.find(e => e.id === id)?.full_name).filter(Boolean).join(', ');
  };

  const { toast } = useToast();

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 font-display tracking-tight">Engagements & Workload</h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Tax filings, statutory audits, SECP corporate compliances, and working papers ({tasks.length} Active).
          </p>
        </div>

        {isAdminOrManager && (
          <div className="flex items-center gap-3">
            <Button 
              onClick={handleDownloadCSV} 
              variant="outline" 
              className="flex items-center gap-2 border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl px-4 py-2.5 text-xs font-semibold"
            >
              <Download size={15} /> Export CSV
            </Button>
            <Button 
              onClick={() => { setNewTask({}); setEditingTaskId(null); setIsModalOpen(true); }} 
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl px-5 py-2.5 text-xs font-semibold shadow-lg shadow-blue-500/25"
            >
              <Plus size={16} /> Create Task
            </Button>
          </div>
        )}
      </div>

      {/* Controls & Filter Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white/90 backdrop-blur-xl p-3 px-4 rounded-2xl border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)]">
        {/* Tabs for Admin/Manager */}
        {isAdminOrManager ? (
          <div className="flex p-1 bg-slate-100/90 rounded-xl">
            <button
              onClick={() => setViewMode('all')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                viewMode === 'all' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              All 30 Tasks
            </button>
            <button
              onClick={() => setViewMode('team')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                viewMode === 'team' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Team Engagements
            </button>
          </div>
        ) : <div />}

        {/* Search & Status Filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 flex-1 sm:w-64">
            <Search size={16} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              className="outline-none text-xs bg-transparent w-full text-slate-800 placeholder:text-slate-400"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2">
            <Filter size={15} className="text-slate-500" />
            <select
              className="bg-transparent text-xs font-semibold text-slate-700 outline-none cursor-pointer"
              value={filter}
              onChange={e => setFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Not started">Not started</option>
              <option value="In progress">In progress</option>
              <option value="Waiting for client">Waiting for client</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredTasks.map(task => {
          const clientName = getClientName(task.client_id);
          const isOverdue = new Date(task.due_date) < new Date() && task.status !== 'Completed';

          return (
            <div 
              key={task.id}
              className="group relative overflow-hidden rounded-3xl bg-white/90 backdrop-blur-xl p-6 border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Card Top Row: Client & Status Badge */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-100/80 px-2.5 py-1 rounded-lg border border-slate-200/50">
                    <Building2 size={13} className="text-blue-600" />
                    <span className="truncate max-w-[200px]">{clientName}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold
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

                    {isAdminOrManager && (
                      <div className="flex items-center gap-1 ml-1">
                        <button
                          onClick={() => handleEdit(task)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Edit Task"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={() => setDeleteId(task.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Task"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Title */}
                <Link to={`/tasks/${task.id}`}>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 font-display">
                    {task.title}
                  </h3>
                </Link>
                {task.description && (
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {task.description}
                  </p>
                )}
              </div>

              {/* Card Bottom: Metadata & Progress */}
              <div className="mt-5 pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Calendar size={13} className={isOverdue ? "text-rose-600" : "text-slate-400"} />
                    <span className={`font-medium ${isOverdue ? 'text-rose-600 font-bold' : 'text-slate-600'}`}>
                      {isOverdue ? 'Overdue: ' : 'Due: '}
                      {new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>

                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                    task.priority === 'High' ? 'bg-rose-100 text-rose-700' :
                    task.priority === 'Medium' ? 'bg-amber-100 text-amber-800' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {task.priority} Priority
                  </span>
                </div>

                {/* Assignees */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400 font-medium">Assigned Team:</span>
                  <span className="text-xs font-semibold text-slate-700 truncate max-w-[220px]" title={getEmpNames(task.assignee_ids, task.assignee_employee_id)}>
                    {getEmpNames(task.assignee_ids, task.assignee_employee_id)}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      task.status === 'Completed' ? 'bg-emerald-500 w-full' :
                      task.status === 'In progress' ? 'bg-blue-500 w-3/5' :
                      task.status === 'Waiting for client' ? 'bg-amber-500 w-1/3' :
                      'bg-slate-300 w-1/12'
                    }`}
                  />
                </div>
              </div>
            </div>
          );
        })}

        {filteredTasks.length === 0 && (
          <div className="col-span-full py-16 text-center text-slate-400 bg-white/60 rounded-3xl border border-dashed border-slate-200">
            <CheckCircle2 size={40} className="mx-auto mb-2 opacity-30" />
            <p className="text-base font-bold text-slate-700">No tasks found</p>
            <p className="text-xs text-slate-400 mt-1">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingTaskId(null); setNewTask({}); setShowAssignees(false); }} title={editingTaskId ? "Edit Engagement Task" : "Create New Engagement"}>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <Label>Engagement / Task Title *</Label>
            <Input
              type="text"
              value={newTask.title || ''}
              onChange={e => setNewTask({ ...newTask, title: e.target.value })}
              required
              placeholder="e.g. FBR Monthly Sales Tax Return Annexure-C"
              disabled={!isAdminOrManager && !!editingTaskId}
            />
          </div>
          <div>
            <Label>Corporate Client *</Label>
            <select
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500"
              value={newTask.client_id || ''}
              onChange={e => setNewTask({ ...newTask, client_id: e.target.value })}
              required
              disabled={!isAdminOrManager && !!editingTaskId}
            >
              <option value="">Select Corporate Client</option>
              {clients.filter(c => c.status === 'Active').map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <Label className="mb-1 block">Assign Team Members</Label>
              <button
                type="button"
                onClick={() => isAdminOrManager && setShowAssignees(!showAssignees)}
                disabled={!isAdminOrManager && !!editingTaskId}
                className="w-full flex justify-between items-center border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white"
              >
                <span className="truncate text-slate-700 max-w-[90%] text-left text-xs">
                  {newTask.assignee_ids && newTask.assignee_ids.length > 0
                    ? getEmpNames(newTask.assignee_ids)
                    : "Select Team..."}
                </span>
                {isAdminOrManager && <ChevronDown size={14} className={`transition-transform text-slate-400 ${showAssignees ? 'rotate-180' : ''}`} />}
              </button>

              {showAssignees && (
                <div className="absolute z-10 w-full mt-1 rounded-2xl border border-slate-200 bg-white shadow-2xl max-h-60 overflow-y-auto p-2">
                  {employees.filter(e => e.active).map(e => (
                    <div key={e.id} className="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-50 rounded-xl">
                      <input
                        type="checkbox"
                        id={`emp-${e.id}`}
                        checked={newTask.assignee_ids?.includes(e.id) || false}
                        onChange={(ev) => {
                          const checked = ev.target.checked;
                          const current = newTask.assignee_ids || [];
                          if (checked) {
                            setNewTask({ ...newTask, assignee_ids: [...current, e.id] });
                          } else {
                            setNewTask({ ...newTask, assignee_ids: current.filter(id => id !== e.id) });
                          }
                        }}
                        className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <label htmlFor={`emp-${e.id}`} className="cursor-pointer text-xs text-slate-700 flex-1">
                        {e.full_name} ({e.role})
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <Label>Priority</Label>
              <select
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white outline-none"
                value={newTask.priority || 'Medium'}
                onChange={e => setNewTask({ ...newTask, priority: e.target.value as any })}
                disabled={!isAdminOrManager && !!editingTaskId}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>
          <div>
            <Label>Statutory Due Date *</Label>
            <Input
              type="date"
              value={newTask.due_date ? newTask.due_date.split('T')[0] : ''}
              onChange={e => setNewTask({ ...newTask, due_date: e.target.value })}
              required
              disabled={!isAdminOrManager && !!editingTaskId}
            />
          </div>
          <div>
            <Label>Status</Label>
            <select
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white outline-none"
              value={newTask.status || 'Not started'}
              onChange={e => setNewTask({ ...newTask, status: e.target.value as any })}
            >
              <option value="Not started">Not started</option>
              <option value="In progress">In progress</option>
              <option value="Waiting for client">Waiting for client</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div>
            <Label>Description / Engagement Scope</Label>
            <textarea
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm h-24 bg-white outline-none focus:ring-2 focus:ring-blue-500"
              value={newTask.description || ''}
              onChange={e => setNewTask({ ...newTask, description: e.target.value })}
              placeholder="Enter working paper details or statutory references..."
            />
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={() => { setIsModalOpen(false); setEditingTaskId(null); setNewTask({}); }}>Cancel</Button>
            <Button type="submit" disabled={loading} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
              {loading ? (editingTaskId ? 'Updating...' : 'Creating...') : (editingTaskId ? 'Update Task' : 'Create Task')}
            </Button>
          </div>
        </form>
      </Modal>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the task and all associated working papers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Tasks;