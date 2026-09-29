import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { User, Employee } from '@/types';
import { getEmployees, updateEmployee, deleteEmployee } from '@/services/api';
import { Card, Button, Input, Modal, Label } from '@/components/ca/ui';
import { UserPlus, UserX, UserCheck, Trash2, Edit, Search, Download, Phone, Mail, Award, ShieldCheck, CheckCircle2 } from 'lucide-react';
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

const Employees: React.FC<{ user: User }> = ({ user }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEmp, setNewEmp] = useState<{ full_name: string; email: string; phone: string; designation: string; employee_code: string }>({
    full_name: '',
    email: '',
    phone: '',
    designation: '',
    employee_code: ''
  });
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingEmp, setEditingEmp] = useState<Employee | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadEmployees();

    const channel = supabase
      .channel('employees-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'employees' },
        () => loadEmployees()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadEmployees = async () => {
    try {
      const data = await getEmployees();
      setEmployees(data);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmp.full_name || !newEmp.email || !newEmp.employee_code) return;

    if (newEmp.employee_code.length < 6) {
      toast({ title: 'Error', description: 'Employee Code must be at least 6 characters', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      const tempSupabase = createClient(
        import.meta.env.VITE_SUPABASE_URL,
        import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        {
          auth: {
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false
          }
        }
      );

      const { data: authData, error: authError } = await tempSupabase.auth.signUp({
        email: newEmp.email,
        password: newEmp.employee_code,
        options: {
          data: { full_name: newEmp.full_name }
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Failed to create user account');

      const { error: empError } = await supabase
        .from('employees')
        .insert({
          user_id: authData.user.id,
          full_name: newEmp.full_name,
          email: newEmp.email,
          phone: newEmp.phone || null,
          designation: newEmp.designation || 'Staff',
          employee_code: newEmp.employee_code
        });

      if (empError) throw empError;

      setIsModalOpen(false);
      setNewEmp({ full_name: '', email: '', phone: '', designation: '', employee_code: '' });
      toast({
        title: 'Employee Created!',
        description: `Login: ${newEmp.email} | Password: ${newEmp.employee_code}`
      });
      loadEmployees();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (emp: Employee) => {
    try {
      await updateEmployee({ ...emp, active: !emp.active });
      toast({ title: 'Success', description: `Employee ${emp.active ? 'deactivated' : 'activated'}` });
      loadEmployees();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleEditClick = (emp: Employee) => {
    setEditingEmp(emp);
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEmp) return;

    setLoading(true);
    try {
      await updateEmployee(editingEmp);
      toast({ title: 'Success', description: 'Employee updated successfully' });
      setIsEditModalOpen(false);
      setEditingEmp(null);
      loadEmployees();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteEmployee(deleteId);
      toast({ title: 'Success', description: 'Employee deleted successfully' });
      loadEmployees();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setDeleteId(null);
    }
  };

  const handleDownloadCSV = () => {
    if (employees.length === 0) {
      toast({ title: 'Info', description: 'No employees to download', variant: 'default' });
      return;
    }

    const headers = ['Full Name', 'Email', 'Phone', 'Designation', 'Status', 'Employee Code'];
    const csvRows = [headers.join(',')];

    employees.forEach(e => {
      const row = [
        `"${(e.full_name || '').replace(/"/g, '""')}"`,
        `"${(e.email || '').replace(/"/g, '""')}"`,
        `"${(e.phone || '').replace(/"/g, '""')}"`,
        `"${(e.designation || '').replace(/"/g, '""')}"`,
        e.active ? 'Active' : 'Inactive',
        e.employee_code
      ];
      csvRows.push(row.join(','));
    });

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `employees_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getInitials = (name: string) => {
    if (!name) return 'CA';
    const parts = name.split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const getAvatarGradient = (name: string) => {
    const gradients = [
      'from-blue-600 to-indigo-700 text-white shadow-blue-500/20',
      'from-emerald-500 to-teal-700 text-white shadow-emerald-500/20',
      'from-purple-600 to-indigo-800 text-white shadow-purple-500/20',
      'from-amber-500 to-orange-700 text-white shadow-amber-500/20',
      'from-rose-500 to-red-700 text-white shadow-rose-500/20',
      'from-cyan-600 to-blue-800 text-white shadow-cyan-500/20',
    ];
    let hash = 0;
    for (let i = 0; i < (name || '').length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return gradients[Math.abs(hash) % gradients.length];
  };

  const getDesignationBadge = (des: string) => {
    const d = (des || '').toLowerCase();
    if (d.includes('partner') || d.includes('fca')) {
      return 'bg-amber-50 text-amber-800 border-amber-200/80';
    }
    if (d.includes('manager') || d.includes('aca')) {
      return 'bg-blue-50 text-blue-800 border-blue-200/80';
    }
    if (d.includes('senior') || d.includes('lead')) {
      return 'bg-purple-50 text-purple-800 border-purple-200/80';
    }
    return 'bg-slate-100 text-slate-700 border-slate-200';
  };

  const filteredEmployees = employees.filter(emp =>
    emp.full_name.toLowerCase().includes(search.toLowerCase()) ||
    emp.email.toLowerCase().includes(search.toLowerCase()) ||
    (emp.designation && emp.designation.toLowerCase().includes(search.toLowerCase())) ||
    (emp.employee_code && emp.employee_code.toLowerCase().includes(search.toLowerCase()))
  );

  const isAdminOrManager = user.role === 'admin' || user.role === 'manager';
  if (!isAdminOrManager) return <div>Access Denied</div>;

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 font-display tracking-tight">Audit & Tax Professionals</h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Partners (FCA), Practice Managers, Audit Seniors, and Statutory Trainees ({employees.length} Members).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            onClick={handleDownloadCSV} 
            variant="outline" 
            className="flex items-center gap-2 border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl px-4 py-2.5 text-xs font-semibold"
          >
            <Download size={15} /> Export Roster
          </Button>
          <Button 
            onClick={() => setIsModalOpen(true)} 
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl px-5 py-2.5 text-xs font-semibold shadow-lg shadow-blue-500/25"
          >
            <UserPlus size={16} /> Add Team Member
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3 bg-white/90 backdrop-blur-xl p-2.5 px-4 rounded-2xl border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] w-full max-w-md">
        <Search size={18} className="text-slate-400" />
        <input
          type="text"
          placeholder="Search by name, email, designation, or code..."
          className="flex-1 outline-none text-xs md:text-sm bg-transparent placeholder:text-slate-400 text-slate-800"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && (
          <button onClick={() => setSearch('')} className="text-xs text-slate-400 hover:text-slate-600">
            Clear
          </button>
        )}
      </div>

      {/* Employees Table */}
      <div className="rounded-3xl bg-white/90 backdrop-blur-xl border border-slate-200/80 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50/70 text-slate-500 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Professional</th>
                <th className="px-6 py-4">Email Address</th>
                <th className="px-6 py-4">Designation & Rank</th>
                <th className="px-6 py-4">Contact Phone</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEmployees.map(emp => (
                <tr key={emp.id} className="hover:bg-blue-50/30 transition-colors group">
                  {/* Name & Avatar */}
                  <td className="px-6 py-4 font-medium">
                    <div className="flex items-center gap-3.5">
                      <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br flex items-center justify-center font-bold text-xs shadow-md ${getAvatarGradient(emp.full_name)}`}>
                        {getInitials(emp.full_name)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{emp.full_name}</p>
                        <p className="font-mono text-[10px] text-slate-400">{emp.employee_code}</p>
                      </div>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="px-6 py-4">
                    <span className="text-xs text-slate-600 font-medium">{emp.email}</span>
                  </td>

                  {/* Designation */}
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold border ${getDesignationBadge(emp.designation)}`}>
                      <Award size={12} className="opacity-70" />
                      {emp.designation || 'Practice Member'}
                    </span>
                  </td>

                  {/* Phone */}
                  <td className="px-6 py-4">
                    <span className="text-xs text-slate-600 font-medium">{emp.phone || '+92 300 0000000'}</span>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      emp.active 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${emp.active ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                      {emp.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleEditClick(emp)}
                        className="p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        title="Edit Member"
                      >
                        <Edit size={15} />
                      </button>
                      <button
                        onClick={() => toggleStatus(emp)}
                        className={`p-2 rounded-xl transition-colors ${
                          emp.active 
                            ? 'text-slate-400 hover:text-amber-600 hover:bg-amber-50' 
                            : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
                        }`}
                        title={emp.active ? 'Deactivate' : 'Activate'}
                      >
                        {emp.active ? <UserX size={15} /> : <UserCheck size={15} />}
                      </button>
                      <button
                        onClick={() => setDeleteId(emp.id)}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete Record"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredEmployees.length === 0 && (
            <div className="p-12 text-center text-slate-400">
              <CheckCircle2 size={36} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm font-medium">No team members found matching your search.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal: Add Employee */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register Team Member">
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <Label>Full Name (with credentials) *</Label>
            <Input placeholder="e.g. Tariq Mehmood FCA" value={newEmp.full_name} onChange={e => setNewEmp({ ...newEmp, full_name: e.target.value })} required />
          </div>
          <div>
            <Label>Firm Email Address (Login ID) *</Label>
            <Input type="email" placeholder="e.g. tariq.partner@cafirm.pk" value={newEmp.email} onChange={e => setNewEmp({ ...newEmp, email: e.target.value })} required />
          </div>
          <div>
            <Label>Employee Code (Password) *</Label>
            <Input
              value={newEmp.employee_code}
              onChange={e => setNewEmp({ ...newEmp, employee_code: e.target.value })}
              required
              minLength={6}
              placeholder="e.g. EMP-PK-03"
            />
            <p className="text-[11px] text-slate-400 mt-1">This code will serve as the initial login password.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Mobile Phone</Label>
              <Input placeholder="+92 322 4455667" value={newEmp.phone} onChange={e => setNewEmp({ ...newEmp, phone: e.target.value })} />
            </div>
            <div>
              <Label>Designation</Label>
              <Input placeholder="e.g. Partner - Tax & Legal" value={newEmp.designation} onChange={e => setNewEmp({ ...newEmp, designation: e.target.value })} />
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={loading} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
              {loading ? 'Creating...' : 'Create Account'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Edit Employee */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Professional Record">
        {editingEmp && (
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <Label>Full Name *</Label>
              <Input
                value={editingEmp.full_name}
                onChange={e => setEditingEmp({ ...editingEmp, full_name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input value={editingEmp.email} disabled className="bg-slate-100 text-slate-500" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Phone</Label>
                <Input
                  value={editingEmp.phone || ''}
                  onChange={e => setEditingEmp({ ...editingEmp, phone: e.target.value })}
                />
              </div>
              <div>
                <Label>Designation</Label>
                <Input
                  value={editingEmp.designation || ''}
                  onChange={e => setEditingEmp({ ...editingEmp, designation: e.target.value })}
                />
              </div>
            </div>
            <div className="pt-4 flex justify-end gap-3">
              <Button type="button" variant="secondary" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={loading} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
                {loading ? 'Updating...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Delete Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Team Member?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the employee record from the practice database.
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

export default Employees;