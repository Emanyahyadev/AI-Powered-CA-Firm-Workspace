import React, { useState, useEffect } from 'react';
import { Card, Modal, Input, Select, Button, Label } from '@/components/ca/ui';
import { User, Invoice, Client, Task, InvoiceStatus } from '@/types';
import { FileText, DollarSign, Clock, CheckCircle2, Plus, Pencil, Trash2, CreditCard, Download, Search, AlertTriangle, Building2, TrendingUp } from 'lucide-react';
import { getInvoices, saveInvoice, deleteInvoice, getInvoiceStats, getClients, getTasks, savePayment } from '@/services/api';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
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

interface InvoicesProps {
  user: User;
}

const Invoices: React.FC<InvoicesProps> = ({ user }) => {
  const { toast } = useToast();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState({ totalInvoices: 0, totalPaid: 0, totalPending: 0, totalOverdue: 0 });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [payingInvoice, setPayingInvoice] = useState<Invoice | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const [formData, setFormData] = useState({
    client_id: '',
    task_id: '',
    amount: '',
    description: '',
    due_date: '',
    notes: '',
    status: 'Draft' as InvoiceStatus
  });

  const [paymentData, setPaymentData] = useState({
    amount: '',
    payment_method: '',
    reference_number: '',
    notes: ''
  });

  const fetchData = async () => {
    try {
      const [invoicesData, clientsData, tasksData, statsData] = await Promise.all([
        getInvoices(),
        getClients(),
        getTasks(user),
        getInvoiceStats()
      ]);
      setInvoices(invoicesData);
      setClients(clientsData);
      setTasks(tasksData);
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const channel = supabase
      .channel('invoices-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'invoices' }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'payments' }, () => fetchData())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const generateInvoiceNumber = () => {
    const prefix = 'INV-PK-2026';
    const random = Math.floor(Math.random() * 900 + 100).toString();
    return `${prefix}-${random}`;
  };

  const resetForm = () => {
    setFormData({
      client_id: '',
      task_id: '',
      amount: '',
      description: '',
      due_date: '',
      notes: '',
      status: 'Draft'
    });
    setEditingInvoice(null);
  };

  const handleOpenModal = (invoice?: Invoice) => {
    if (invoice) {
      setEditingInvoice(invoice);
      setFormData({
        client_id: invoice.client_id || '',
        task_id: invoice.task_id || '',
        amount: invoice.amount.toString(),
        description: invoice.description || '',
        due_date: invoice.due_date,
        notes: invoice.notes || '',
        status: invoice.status
      });
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const handleSaveInvoice = async () => {
    if (!formData.client_id || !formData.amount || !formData.due_date) {
      toast({ title: 'Error', description: 'Please fill in required fields', variant: 'destructive' });
      return;
    }

    try {
      await saveInvoice({
        id: editingInvoice?.id,
        invoice_number: editingInvoice?.invoice_number || generateInvoiceNumber(),
        client_id: formData.client_id,
        task_id: formData.task_id || null,
        amount: parseFloat(formData.amount),
        description: formData.description || null,
        due_date: formData.due_date,
        notes: formData.notes || null,
        status: formData.status,
        issue_date: editingInvoice?.issue_date || format(new Date(), 'yyyy-MM-dd'),
        created_by: user.id
      });
      toast({ title: 'Success', description: editingInvoice ? 'Invoice updated' : 'Invoice created' });
      setShowModal(false);
      resetForm();
      fetchData();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleDeleteInvoice = async () => {
    if (!deleteId) return;
    try {
      await deleteInvoice(deleteId);
      toast({ title: 'Success', description: 'Invoice deleted successfully' });
      fetchData();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setDeleteId(null);
    }
  };

  const handleMarkAsPaid = (invoice: Invoice) => {
    setPayingInvoice(invoice);
    setPaymentData({
      amount: invoice.amount.toString(),
      payment_method: 'Bank Transfer (1LINK / RTGS)',
      reference_number: `FT-${Math.floor(Math.random() * 900000 + 100000)}`,
      notes: 'Payment confirmed in firm account'
    });
    setShowPaymentModal(true);
  };

  const handleRecordPayment = async () => {
    if (!payingInvoice || !paymentData.amount) return;

    try {
      await savePayment({
        invoice_id: payingInvoice.id,
        amount: parseFloat(paymentData.amount),
        payment_date: format(new Date(), 'yyyy-MM-dd'),
        payment_method: paymentData.payment_method || null,
        reference_number: paymentData.reference_number || null,
        notes: paymentData.notes || null,
        created_by: user.id
      });

      await saveInvoice({
        id: payingInvoice.id,
        status: 'Paid',
        paid_date: format(new Date(), 'yyyy-MM-dd')
      });

      toast({ title: 'Success', description: 'Payment recorded successfully' });
      setShowPaymentModal(false);
      setPayingInvoice(null);
      fetchData();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const getClientName = (clientId: string | null) => {
    if (!clientId) return 'N/A';
    const client = clients.find(c => c.id === clientId);
    return client?.name || 'Corporate Client';
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

  const handleDownloadCSV = () => {
    if (invoices.length === 0) {
      toast({ title: 'Info', description: 'No invoices to download', variant: 'default' });
      return;
    }

    const headers = ['Invoice Number', 'Client', 'Amount (PKR)', 'Status', 'Issue Date', 'Due Date', 'Description'];
    const csvRows = [headers.join(',')];

    invoices.forEach(inv => {
      const clientName = getClientName(inv.client_id);
      const row = [
        `"${inv.invoice_number}"`,
        `"${clientName.replace(/"/g, '""')}"`,
        inv.amount,
        inv.status,
        inv.issue_date,
        inv.due_date,
        `"${(inv.description || '').replace(/"/g, '""')}"`
      ];
      csvRows.push(row.join(','));
    });

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `invoices_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredInvoices = invoices.filter(inv => {
    const clientName = getClientName(inv.client_id);
    const matchesSearch = inv.invoice_number.toLowerCase().includes(search.toLowerCase()) ||
      clientName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredTasks = tasks.filter(t => !formData.client_id || t.client_id === formData.client_id);

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-slate-400 font-medium">Loading Billing Suite...</div>;
  }

  const recoveryRate = stats.totalPaid + stats.totalPending > 0
    ? Math.round((stats.totalPaid / (stats.totalPaid + stats.totalPending + stats.totalOverdue)) * 100)
    : 85;

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 font-display tracking-tight">Invoices & Financial Realization</h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Pakistani Rupee (PKR) fee notes, statutory audit billings, and payment settlements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            onClick={handleDownloadCSV} 
            variant="outline" 
            className="flex items-center gap-2 border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl px-4 py-2.5 text-xs font-semibold"
          >
            <Download size={15} /> Export CSV
          </Button>
          <Button 
            onClick={() => handleOpenModal()} 
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl px-5 py-2.5 text-xs font-semibold shadow-lg shadow-blue-500/25"
          >
            <Plus size={16} /> Create Invoice
          </Button>
        </div>
      </div>

      {/* 4 Bento KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Invoices */}
        <div className="group relative overflow-hidden rounded-3xl bg-white/90 backdrop-blur-xl p-6 border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] hover:shadow-xl hover:border-blue-300 transition-all duration-300">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 font-display">Total Invoices</p>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-2 font-display tracking-tight">
                {stats.totalInvoices || invoices.length}
              </h3>
            </div>
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-500/25">
              <FileText size={22} />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">30 Active Mandates</span>
            <span className="font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">FY26-27</span>
          </div>
        </div>

        {/* Card 2: Paid */}
        <div className="group relative overflow-hidden rounded-3xl bg-white/90 backdrop-blur-xl p-6 border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] hover:shadow-xl hover:border-emerald-300 transition-all duration-300">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 font-display">Realized (Paid)</p>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-2 font-display tracking-tight">
                PKR {(stats.totalPaid / 1000000).toFixed(2)}M
              </h3>
            </div>
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25">
              <DollarSign size={22} />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
              <TrendingUp size={12} /> {recoveryRate}% Realized
            </span>
            <span className="text-slate-400">Settled</span>
          </div>
        </div>

        {/* Card 3: Pending */}
        <div className="group relative overflow-hidden rounded-3xl bg-white/90 backdrop-blur-xl p-6 border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] hover:shadow-xl hover:border-amber-300 transition-all duration-300">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 font-display">Pending / Sent</p>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-2 font-display tracking-tight">
                PKR {(stats.totalPending / 1000000).toFixed(2)}M
              </h3>
            </div>
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/25">
              <Clock size={22} />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded-md">Awaiting Transfer</span>
            <span className="text-slate-400">Under Term</span>
          </div>
        </div>

        {/* Card 4: Overdue */}
        <div className="group relative overflow-hidden rounded-3xl bg-white/90 backdrop-blur-xl p-6 border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] hover:shadow-xl hover:border-rose-300 transition-all duration-300">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 font-display">Overdue Receivables</p>
              <h3 className="text-2xl font-extrabold text-rose-600 mt-2 font-display tracking-tight">
                PKR {(stats.totalOverdue / 1000000).toFixed(2)}M
              </h3>
            </div>
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-lg shadow-rose-500/25">
              <AlertTriangle size={22} />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-rose-600 font-semibold bg-rose-50 px-2 py-0.5 rounded-md">Follow-up Required</span>
            <span className="text-slate-400">Past Due</span>
          </div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white/90 backdrop-blur-xl p-3 px-4 rounded-2xl border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 flex-1 sm:max-w-md">
          <Search size={16} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search by invoice number or corporate client..."
            className="outline-none text-xs bg-transparent w-full text-slate-800 placeholder:text-slate-400"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status:</span>
          <select
            className="bg-transparent text-xs font-semibold text-slate-700 outline-none cursor-pointer"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Sent">Sent</option>
            <option value="Draft">Draft</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>
      </div>

      {/* Invoice Table */}
      <div className="rounded-3xl bg-white/90 backdrop-blur-xl border border-slate-200/80 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50/70 text-slate-500 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Invoice #</th>
                <th className="px-6 py-4">Corporate Client</th>
                <th className="px-6 py-4">Fee Amount (PKR)</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Issue Date</th>
                <th className="px-6 py-4">Due Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.map(invoice => {
                const clientName = getClientName(invoice.client_id);

                return (
                  <tr key={invoice.id} className="hover:bg-blue-50/30 transition-colors group">
                    {/* Invoice Number */}
                    <td className="px-6 py-4 font-mono text-xs font-bold text-slate-800">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200/60">
                        {invoice.invoice_number}
                      </span>
                    </td>

                    {/* Client Name with Initials */}
                    <td className="px-6 py-4 font-medium">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shadow-sm ${getClientColor(clientName)}`}>
                          {getInitials(clientName)}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">{clientName}</p>
                          <p className="text-[10px] text-slate-400">NTN Verified</p>
                        </div>
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="px-6 py-4">
                      <span className="text-sm font-extrabold text-slate-900 font-display">
                        PKR {invoice.amount.toLocaleString()}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        invoice.status === 'Paid' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        invoice.status === 'Sent' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                        invoice.status === 'Draft' ? 'bg-slate-100 text-slate-700 border border-slate-200' :
                        'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          invoice.status === 'Paid' ? 'bg-emerald-500' :
                          invoice.status === 'Sent' ? 'bg-blue-500' :
                          invoice.status === 'Draft' ? 'bg-slate-400' :
                          'bg-rose-500 animate-pulse'
                        }`} />
                        {invoice.status}
                      </span>
                    </td>

                    {/* Issue Date */}
                    <td className="px-6 py-4 text-xs text-slate-500 whitespace-nowrap">
                      {format(new Date(invoice.issue_date), 'dd MMM yyyy')}
                    </td>

                    {/* Due Date */}
                    <td className="px-6 py-4 text-xs font-medium text-slate-600 whitespace-nowrap">
                      {format(new Date(invoice.due_date), 'dd MMM yyyy')}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenModal(invoice)}
                          className="p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Edit Invoice"
                        >
                          <Pencil size={15} />
                        </button>
                        {invoice.status !== 'Paid' && (
                          <button
                            onClick={() => handleMarkAsPaid(invoice)}
                            className="p-2 rounded-xl text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                            title="Record Payment"
                          >
                            <CreditCard size={15} />
                          </button>
                        )}
                        <button
                          onClick={() => setDeleteId(invoice.id)}
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Invoice"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredInvoices.length === 0 && (
            <div className="p-12 text-center text-slate-400">
              <FileText size={36} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm font-medium">No invoices found matching criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal: Create/Edit */}
      <Modal isOpen={showModal} onClose={() => { setShowModal(false); resetForm(); }} title={editingInvoice ? 'Edit Fee Note / Invoice' : 'Create Statutory Invoice'}>
        <div className="space-y-4">
          <div>
            <Label>Corporate Client *</Label>
            <select
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.client_id}
              onChange={(e) => setFormData({ ...formData, client_id: e.target.value, task_id: '' })}
            >
              <option value="">Select Corporate Client</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <Label>Statutory Engagement / Task (Optional)</Label>
            <select
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white outline-none"
              value={formData.task_id}
              onChange={(e) => setFormData({ ...formData, task_id: e.target.value })}
            >
              <option value="">Direct Retainer / General Advisory</option>
              {filteredTasks.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Amount (PKR) *</Label>
              <Input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="e.g. 250000"
              />
            </div>
            <div>
              <Label>Statutory Due Date *</Label>
              <Input
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              />
            </div>
          </div>
          <div>
            <Label>Service Scope Description</Label>
            <Input
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="e.g. Statutory ISA 700 Audit Fee & FBR Filing"
            />
          </div>
          {editingInvoice && (
            <div>
              <Label>Status</Label>
              <select
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white outline-none"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as InvoiceStatus })}
              >
                <option value="Draft">Draft</option>
                <option value="Sent">Sent</option>
                <option value="Paid">Paid</option>
                <option value="Overdue">Overdue</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          )}
          <div>
            <Label>Internal Working Notes</Label>
            <Input
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="e.g. Includes WHT Sec 153 tax deduction at source"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => { setShowModal(false); resetForm(); }}>Cancel</Button>
            <Button onClick={handleSaveInvoice} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
              {editingInvoice ? 'Update Invoice' : 'Issue Invoice'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal: Record Payment */}
      <Modal isOpen={showPaymentModal} onClose={() => { setShowPaymentModal(false); setPayingInvoice(null); }} title="Record Fee Payment Settlement">
        <div className="space-y-4">
          <div>
            <Label>Settlement Amount (PKR) *</Label>
            <Input
              type="number"
              value={paymentData.amount}
              onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
            />
          </div>
          <div>
            <Label>Banking / Settlement Channel</Label>
            <Input
              value={paymentData.payment_method}
              onChange={(e) => setPaymentData({ ...paymentData, payment_method: e.target.value })}
              placeholder="e.g. Bank Transfer (1LINK / RTGS), Cheque, Direct Deposit"
            />
          </div>
          <div>
            <Label>Bank Reference / Transaction ID</Label>
            <Input
              value={paymentData.reference_number}
              onChange={(e) => setPaymentData({ ...paymentData, reference_number: e.target.value })}
              placeholder="e.g. FT-8921829"
            />
          </div>
          <div>
            <Label>Settlement Notes</Label>
            <Input
              value={paymentData.notes}
              onChange={(e) => setPaymentData({ ...paymentData, notes: e.target.value })}
              placeholder="e.g. Cleared via Meezan Corporate Account"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => { setShowPaymentModal(false); setPayingInvoice(null); }}>Cancel</Button>
            <Button onClick={handleRecordPayment} className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/20">
              Confirm Settlement
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Invoice Record?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the invoice and related billing line items.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteInvoice} className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Invoices;
