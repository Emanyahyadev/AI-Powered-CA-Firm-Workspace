import React, { useState, useEffect } from 'react';
import { User, Client } from '@/types';
import { getClients, saveClient, deleteClient } from '@/services/api';
import { Card, Button, Input, Modal, Label, Badge } from '@/components/ca/ui';
import { Search, Plus, Edit, Trash2, Building2, Download, Phone, Mail, FileText, CheckCircle2, ShieldCheck } from 'lucide-react';
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

const Clients: React.FC<{ user: User }> = ({ user }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Partial<Client>>({});
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadClients();

    const channel = supabase
      .channel('clients-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'clients' },
        () => loadClients()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadClients = async () => {
    try {
      const data = await getClients();
      setClients(data);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClient.name || !editingClient.client_code) return;

    setLoading(true);
    try {
      await saveClient(editingClient);
      setIsModalOpen(false);
      setEditingClient({});
      toast({ title: 'Success', description: 'Client saved successfully' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteClient(deleteId);
      toast({ title: 'Success', description: 'Client deleted successfully' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setDeleteId(null);
    }
  };

  const handleDownloadCSV = () => {
    if (clients.length === 0) {
      toast({ title: 'Info', description: 'No clients to download', variant: 'default' });
      return;
    }

    const headers = ['Client Code', 'Name', 'Contact Person', 'Phone', 'Email', 'NTN', 'STRN', 'Status'];
    const csvRows = [headers.join(',')];

    clients.forEach(c => {
      const row = [
        c.client_code,
        `"${(c.name || '').replace(/"/g, '""')}"`,
        `"${(c.contact_person || '').replace(/"/g, '""')}"`,
        `"${(c.contact_phone || '').replace(/"/g, '""')}"`,
        `"${(c.contact_email || '').replace(/"/g, '""')}"`,
        `"${(c.pan_number || '').replace(/"/g, '""')}"`,
        `"${(c.gst_number || '').replace(/"/g, '""')}"`,
        c.status
      ];
      csvRows.push(row.join(','));
    });

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `clients_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openNew = () => {
    setEditingClient({});
    setIsModalOpen(true);
  };

  const openEdit = (c: Client) => {
    setEditingClient(c);
    setIsModalOpen(true);
  };

  const getInitials = (name: string) => {
    if (!name) return 'CA';
    const parts = name.split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const getClientColor = (name: string) => {
    const colors = [
      'bg-blue-600 text-white shadow-blue-500/20',
      'bg-indigo-600 text-white shadow-indigo-500/20',
      'bg-emerald-600 text-white shadow-emerald-500/20',
      'bg-violet-600 text-white shadow-violet-500/20',
      'bg-rose-600 text-white shadow-rose-500/20',
      'bg-amber-600 text-white shadow-amber-500/20',
      'bg-teal-600 text-white shadow-teal-500/20',
    ];
    let hash = 0;
    for (let i = 0; i < (name || '').length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const filteredClients = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.client_code.toLowerCase().includes(search.toLowerCase()) ||
    (c.pan_number && c.pan_number.toLowerCase().includes(search.toLowerCase())) ||
    (c.contact_person && c.contact_person.toLowerCase().includes(search.toLowerCase()))
  );

  const isAdmin = user.role === 'admin';
  const isAdminOrManager = isAdmin || user.role === 'manager';

  if (!isAdminOrManager) return <div>Access Denied</div>;

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 font-display tracking-tight">Corporate Clients</h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Pakistani enterprise client roster, tax identifiers (NTN / STRN), and compliance records ({clients.length} Entities).
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
            onClick={openNew} 
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl px-5 py-2.5 text-xs font-semibold shadow-lg shadow-blue-500/25"
          >
            <Plus size={16} /> Add Corporate Client
          </Button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex items-center gap-3 bg-white/90 backdrop-blur-xl p-2.5 px-4 rounded-2xl border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] w-full max-w-md">
        <Search size={18} className="text-slate-400" />
        <input
          type="text"
          placeholder="Search by client name, code, NTN, or contact person..."
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

      {/* Clients Master Table */}
      <div className="rounded-3xl bg-white/90 backdrop-blur-xl border border-slate-200/80 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50/70 text-slate-500 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Corporate Entity</th>
                <th className="px-6 py-4">Code</th>
                <th className="px-6 py-4">Tax IDs (NTN / STRN)</th>
                <th className="px-6 py-4">Primary Contact</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredClients.map(client => (
                <tr key={client.id} className="hover:bg-blue-50/30 transition-colors group">
                  {/* Entity Name & Initials */}
                  <td className="px-6 py-4 font-medium">
                    <div className="flex items-center gap-3.5">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-extrabold text-sm shadow-md ${getClientColor(client.name)}`}>
                        {getInitials(client.name)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{client.name}</p>
                        <p className="text-xs text-slate-400 font-normal">{client.contact_email || 'No email registered'}</p>
                      </div>
                    </div>
                  </td>

                  {/* Code */}
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200/60">
                      {client.client_code}
                    </span>
                  </td>

                  {/* Tax IDs */}
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                        <span className="text-[10px] font-bold text-slate-400">NTN:</span>
                        <span className="font-mono">{client.pan_number || 'N/A'}</span>
                      </div>
                      {client.gst_number && (
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                          <span className="text-[10px] font-bold text-slate-400">STRN:</span>
                          <span className="font-mono">{client.gst_number}</span>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Contact Person */}
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-xs font-semibold text-slate-800">{client.contact_person || 'N/A'}</p>
                      {client.contact_phone && (
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <Phone size={11} /> {client.contact_phone}
                        </p>
                      )}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      client.status === 'Active' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${client.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                      {client.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button 
                        onClick={() => openEdit(client)} 
                        className="p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        title="Edit Client"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => setDeleteId(client.id)} 
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete Client"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredClients.length === 0 && (
            <div className="p-12 text-center text-slate-400">
              <Building2 size={36} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm font-medium">No clients found matching your search.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal for Client */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingClient.id ? 'Edit Corporate Client' : 'New Corporate Client'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Client Name *</Label>
              <Input placeholder="e.g. Systems Limited" value={editingClient.name || ''} onChange={e => setEditingClient({ ...editingClient, name: e.target.value })} required />
            </div>
            <div>
              <Label>Code (Short) *</Label>
              <Input placeholder="e.g. SYS-PK" value={editingClient.client_code || ''} onChange={e => setEditingClient({ ...editingClient, client_code: e.target.value })} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Contact Person</Label>
              <Input placeholder="e.g. Asif Peer" value={editingClient.contact_person || ''} onChange={e => setEditingClient({ ...editingClient, contact_person: e.target.value })} />
            </div>
            <div>
              <Label>Phone</Label>
              <Input placeholder="e.g. +92 42 111 797 836" value={editingClient.contact_phone || ''} onChange={e => setEditingClient({ ...editingClient, contact_phone: e.target.value })} />
            </div>
          </div>
          <div>
            <Label>Email</Label>
            <Input type="email" placeholder="e.g. corporate@systemsltd.com" value={editingClient.contact_email || ''} onChange={e => setEditingClient({ ...editingClient, contact_email: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>NTN (National Tax Number)</Label>
              <Input placeholder="e.g. 0712345-6" value={editingClient.pan_number || ''} onChange={e => setEditingClient({ ...editingClient, pan_number: e.target.value })} />
            </div>
            <div>
              <Label>STRN / Sales Tax Reg</Label>
              <Input placeholder="e.g. 03-01-9999-001-19" value={editingClient.gst_number || ''} onChange={e => setEditingClient({ ...editingClient, gst_number: e.target.value })} />
            </div>
          </div>
          <div>
            <Label>Status</Label>
            <select
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500"
              value={editingClient.status || 'Active'}
              onChange={e => setEditingClient({ ...editingClient, status: e.target.value as 'Active' | 'Inactive' })}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={loading} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
              {loading ? 'Saving...' : 'Save Client'}
            </Button>
          </div>
        </form>
      </Modal>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Client Record?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the corporate client record from your firm's database.
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

export default Clients;