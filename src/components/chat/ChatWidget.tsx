import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  X, 
  Bot, 
  User, 
  Trash2, 
  Key, 
  Download, 
  Sparkles, 
  Cpu, 
  Copy, 
  Check,
  Building2,
  CalendarCheck,
  FileSpreadsheet,
  TrendingUp,
  Receipt,
  UserPlus
} from 'lucide-react';
import { toast } from "sonner";
import { mockStore } from "@/services/mockDataStore";

const DEFAULT_NVIDIA_KEY = "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";
const ACTIVE_NVIDIA_MODELS = [
  'deepseek-ai/deepseek-v4.1-flash',
  'openai/gpt-oss-20b',
  'z-ai/glm-5.3-flash'
];

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  actionCard?: {
    type: string;
    title: string;
    subtitle: string;
    downloadFilename?: string;
    downloadContent?: string;
  };
}

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const [nvidiaApiKey, setNvidiaApiKey] = useState<string>(() => {
    return localStorage.getItem('nvidia_api_key') || import.meta.env.VITE_NVIDIA_API_KEY || DEFAULT_NVIDIA_KEY;
  });
  const [tempApiKey, setTempApiKey] = useState(nvidiaApiKey);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 'welcome',
      role: 'assistant', 
      content: "Hello! I am your **CA Practice AI Copilot**.\n\nI can execute real-time actions across your workspace and answer professional statutory queries:\n\n• **Add / Delete Clients** (e.g. *'Add client Prime Packaging Solutions'*)\n• **Create & Manage Tasks** (e.g. *'Create high priority task SECP filing for Apex Logistics'*)\n• **Issue PKR Invoices** (e.g. *'Issue retainer invoice for PKR 150,000'*)\n• **Export CSV Reports** (e.g. *'Export tasks CSV'*)\n\nWhat would you like me to do?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const saveApiKey = (key: string) => {
    const trimmed = key.trim();
    localStorage.setItem('nvidia_api_key', trimmed);
    setNvidiaApiKey(trimmed);
    setApiKeyModalOpen(false);
    toast.success("API Key updated successfully");
  };

  const handleClearChat = () => {
    setMessages([
      { 
        id: Date.now().toString(),
        role: 'assistant', 
        content: "Chat reset. How can I assist you with your firm operations?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    toast.info("Conversation reset");
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Direct CSV trigger
  const triggerDownload = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${filename}`);
  };

  // Execute Direct Actions on mockStore in real time
  const executeLocalAction = (actionName: string, params: any) => {
    let card = undefined;
    if (!params) params = {};

    switch (actionName) {
      case 'createClient': {
        const clientName = params.name || params.clientName || params.client || 'Pakistani Corporate Entity';
        const clientCode = params.client_code || params.clientCode || (clientName.substring(0, 3).toUpperCase() + '-' + Math.floor(Math.random() * 900 + 100));
        const ntn = params.ntn || params.pan_number || '07' + Math.floor(Math.random() * 899999 + 100000) + '-1';
        const strn = params.strn || params.gst_number || '03-01-9999-' + Math.floor(Math.random() * 899 + 100) + '-19';
        
        mockStore.saveClient({
          name: clientName,
          client_code: clientCode,
          contact_person: params.contact_person || params.contactPerson || 'Chief Executive Officer',
          contact_email: `${clientName.toLowerCase().replace(/[^a-z0-9]/g, '')}@firm.pk`,
          contact_phone: '+92 42 111 222 333',
          pan_number: ntn,
          gst_number: strn,
          status: 'Active'
        });
        window.dispatchEvent(new Event('storage'));
        card = {
          type: 'client',
          title: `Registered: ${clientName}`,
          subtitle: `Code: ${clientCode} • NTN: ${ntn}`
        };
        break;
      }

      case 'deleteClient': {
        const clients = mockStore.getClients();
        const targetName = params.name || params.clientName || params.client || params.client_code;
        const target = clients.find(c => 
          (targetName && c.name.toLowerCase().includes(targetName.toLowerCase())) ||
          c.id === params.id
        );
        if (target) {
          mockStore.deleteClient(target.id);
          window.dispatchEvent(new Event('storage'));
          card = {
            type: 'delete',
            title: `Removed: ${target.name}`,
            subtitle: `Record deleted from directory`
          };
        }
        break;
      }

      case 'createTask': {
        const title = params.title || params.taskTitle || 'Statutory Compliance Working Paper';
        const clientName = params.client || params.client_name || params.clientName;
        const clients = mockStore.getClients();
        const employees = mockStore.getEmployees();
        
        let clientId = clients[0]?.id || '1';
        if (clientName) {
          const matched = clients.find(c => c.name.toLowerCase().includes(clientName.toLowerCase()));
          if (matched) clientId = matched.id;
        }

        const dueDate = params.due_date || params.dueDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];
        const priority = params.priority || 'High';

        mockStore.saveTask({
          title: title,
          client_id: clientId,
          assignee_employee_id: employees[0]?.id || '1',
          assignee_ids: [employees[0]?.id || '1'],
          status: 'In progress',
          priority: priority as any,
          due_date: dueDate,
          description: params.description || 'Statutory compliance mandate.'
        });
        window.dispatchEvent(new Event('storage'));
        card = {
          type: 'task',
          title: `Task: ${title}`,
          subtitle: `Priority: ${priority} • Due: ${dueDate}`
        };
        break;
      }

      case 'deleteTask': {
        const tasks = mockStore.getTasks();
        const targetTitle = params.title || params.taskTitle;
        const target = tasks.find(t => 
          (targetTitle && t.title.toLowerCase().includes(targetTitle.toLowerCase())) ||
          t.id === params.id
        );
        if (target) {
          mockStore.deleteTask(target.id);
          window.dispatchEvent(new Event('storage'));
          card = {
            type: 'delete',
            title: `Removed Task: ${target.title}`,
            subtitle: `Purged from compliance board`
          };
        }
        break;
      }

      case 'updateTask': {
        const tasks = mockStore.getTasks();
        const targetTitle = params.title || params.taskTitle;
        const target = tasks.find(t => 
          (targetTitle && t.title.toLowerCase().includes(targetTitle.toLowerCase())) ||
          t.id === params.id
        );
        if (target) {
          const newStatus = params.status || 'Completed';
          mockStore.saveTask({
            ...target,
            status: newStatus as any,
            priority: params.priority || target.priority,
            due_date: params.due_date || params.dueDate || target.due_date
          });
          window.dispatchEvent(new Event('storage'));
          card = {
            type: 'task',
            title: `Task Updated: ${target.title}`,
            subtitle: `Status: ${newStatus}`
          };
        }
        break;
      }

      case 'createEmployee': {
        const name = params.full_name || params.fullName || params.name || 'Associate Chartered Accountant';
        const code = params.employee_code || params.employeeCode || ('EMP-PK-' + Math.floor(Math.random() * 90 + 10));
        const designation = params.designation || 'Audit Senior';
        
        mockStore.saveEmployee({
          full_name: name,
          email: `${name.toLowerCase().replace(/[^a-z0-9]/g, '.')}@cafirm.pk`,
          phone: '+92 300 9876543',
          designation: designation,
          employee_code: code,
          active: true
        });
        window.dispatchEvent(new Event('storage'));
        card = {
          type: 'employee',
          title: `Staff Added: ${name}`,
          subtitle: `Designation: ${designation} • Code: ${code}`
        };
        break;
      }

      case 'deleteEmployee': {
        const emps = mockStore.getEmployees();
        const targetName = params.full_name || params.fullName || params.name;
        const target = emps.find(e => 
          (targetName && e.full_name.toLowerCase().includes(targetName.toLowerCase())) ||
          e.id === params.id
        );
        if (target) {
          mockStore.deleteEmployee(target.id);
          window.dispatchEvent(new Event('storage'));
          card = {
            type: 'delete',
            title: `Removed: ${target.full_name}`,
            subtitle: `Removed from roster`
          };
        }
        break;
      }

      case 'createInvoice': {
        const amount = Number(params.amount) || 350000;
        const invNum = params.invoice_number || params.invoiceNumber || `INV-PK-2026-${Math.floor(Math.random() * 900 + 100)}`;
        const dueDate = params.due_date || params.dueDate || '2026-10-15';
        
        mockStore.saveInvoice({
          invoice_number: invNum,
          client_id: mockStore.getClients()[0]?.id || '1',
          amount: amount,
          status: 'Sent',
          issue_date: new Date().toISOString().split('T')[0],
          due_date: dueDate,
          description: params.description || 'Statutory Retainer & Audit Services'
        });
        window.dispatchEvent(new Event('storage'));
        card = {
          type: 'invoice',
          title: `Invoice: ${invNum}`,
          subtitle: `Amount: PKR ${amount.toLocaleString('en-US')}`
        };
        break;
      }

      case 'exportReport': {
        const type = params.type || params.reportType || 'daily_summary';
        let csv = '';
        let filename = '';

        if (type === 'tasks') {
          const tasks = mockStore.getTasks();
          csv = 'Title,Status,Priority,Due Date\n' + tasks.map(t => `"${t.title}",${t.status},${t.priority},${t.due_date}`).join('\n');
          filename = `tasks_${new Date().toISOString().split('T')[0]}.csv`;
        } else if (type === 'clients') {
          const clients = mockStore.getClients();
          csv = 'Name,Code,Contact,Email\n' + clients.map(c => `"${c.name}","${c.client_code}","${c.contact_person}","${c.contact_email}"`).join('\n');
          filename = `clients_${new Date().toISOString().split('T')[0]}.csv`;
        } else if (type === 'employees') {
          const emps = mockStore.getEmployees();
          csv = 'Full Name,Email,Designation,Code\n' + emps.map(e => `"${e.full_name}","${e.email}","${e.designation}","${e.employee_code}"`).join('\n');
          filename = `roster_${new Date().toISOString().split('T')[0]}.csv`;
        } else {
          const stats = mockStore.getDashboardStats();
          csv = `CA FIRM EXECUTIVE SUMMARY\nActive Clients,${stats.activeClients}\nOpen Tasks,${stats.openTasks}\nOverdue Deadlines,${stats.overdueTasks}\nDate,${new Date().toLocaleDateString()}\n`;
          filename = `practice_summary_${new Date().toISOString().split('T')[0]}.csv`;
        }

        triggerDownload(filename, csv);
        card = {
          type: 'export',
          title: `Exported: ${filename}`,
          subtitle: `File downloaded directly to your computer`,
          downloadFilename: filename,
          downloadContent: csv
        };
        break;
      }
    }

    return card;
  };

  const handleSendMessage = async (e?: React.FormEvent, customMsg?: string) => {
    e?.preventDefault();
    const userMsg = (customMsg || inputValue).trim();
    if (!userMsg || isLoading) return;

    if (!customMsg) setInputValue("");
    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'user',
      content: userMsg,
      timestamp: userTime
    }]);

    setIsLoading(true);

    try {
      let reply = "";
      let action = "";
      let params: any = {};

      const keyToUse = nvidiaApiKey || DEFAULT_NVIDIA_KEY;

      // 1. Direct LLM API Inference
      if (keyToUse && keyToUse.startsWith('nvapi-')) {
        for (const modelName of ACTIVE_NVIDIA_MODELS) {
          try {
            const resp = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${keyToUse}`
              },
              body: JSON.stringify({
                model: modelName,
                messages: [
                  {
                    role: 'system',
                    content: `You are the CA Practice AI Copilot for a Chartered Accountancy firm.
When the user asks you to perform an action (create, add, delete, update tasks, clients, employees, invoices, or export reports), respond with a JSON block:
\`\`\`json
{
  "function": "createTask" | "deleteTask" | "updateTask" | "createClient" | "deleteClient" | "updateClient" | "createEmployee" | "deleteEmployee" | "createInvoice" | "exportReport",
  "params": { ... },
  "explanation": "..."
}
\`\`\`
Otherwise answer naturally with professional Chartered Accountant knowledge in clean GitHub markdown.`
                  },
                  ...messages.slice(-4).map(m => ({ role: m.role, content: m.content })),
                  { role: 'user', content: userMsg }
                ],
                temperature: 0.2,
                max_tokens: 600
              })
            });

            if (resp.ok) {
              const data = await resp.json();
              if (data?.choices?.[0]?.message?.content) {
                reply = data.choices[0].message.content;
                break;
              }
            }
          } catch (modelErr) {
            console.warn(`Direct LLM call with ${modelName} error:`, modelErr);
          }
        }
      }

      // 2. Try Local Agent Server (port 3000)
      if (!reply) {
        try {
          const resp = await fetch('http://localhost:3000/chat', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'x-nvidia-api-key': keyToUse
            },
            body: JSON.stringify({ message: userMsg, apiKey: keyToUse })
          });
          if (resp.ok) {
            const data = await resp.json();
            reply = data.reply || "";
            action = data.action || "";
            params = data.params || {};
          }
        } catch (backendErr) {
          console.warn("Backend server call skipped:", backendErr);
        }
      }

      // 3. Parse JSON tool call in response if any
      if (!action && reply) {
        const match = reply.match(/```json\s*([\s\S]*?)\s*```/) || reply.match(/\{[\s\S]*"function"[\s\S]*\}/);
        if (match) {
          try {
            const raw = match[1] || match[0];
            const parsed = JSON.parse(raw);
            action = parsed.function;
            params = parsed.params || {};
            reply = parsed.explanation || reply.replace(/```json[\s\S]*?```/g, '').trim();
          } catch (e) {}
        }
      }

      // 4. If action was parsed or matched, execute immediately
      let actionCard = undefined;
      if (action) {
        actionCard = executeLocalAction(action, params);
      }

      // 5. Fallback clean response if empty
      if (!reply || !reply.trim()) {
        reply = "Operation processed in workspace. What would you like to do next?";
      }

      const botTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: reply,
        timestamp: botTime,
        actionCard
      }]);

    } catch (err: any) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Error: ${err.message}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Quick Action Pills
  const quickActions = [
    { label: "Daily CSV", icon: FileSpreadsheet, prompt: "Export daily summary CSV" },
    { label: "+ Client", icon: Building2, prompt: "Add corporate client Prime Packaging Solutions" },
    { label: "+ Task", icon: CalendarCheck, prompt: "Create high priority task SECP Form 29 Annual Filing for Apex Logistics" },
    { label: "Overview", icon: TrendingUp, prompt: "Give me firm summary overview" },
  ];

  return (
    <>
      {/* Floating Launcher Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 text-white rounded-2xl shadow-xl hover:shadow-blue-500/30 hover:scale-105 active:scale-95 transition-all border border-white/20"
          >
            <div className="relative">
              <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
                <Bot size={18} className="text-white" />
              </div>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-900" />
            </div>
            <span className="text-xs font-bold tracking-wide">CA Copilot</span>
          </button>
        )}
      </div>

      {/* Clean Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[92vw] sm:w-[420px] h-[600px] max-h-[85vh] flex flex-col rounded-2xl overflow-hidden bg-slate-950/95 backdrop-blur-2xl border border-slate-800 shadow-2xl text-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-200">
          
          {/* Header */}
          <div className="px-4 py-3 bg-slate-900/90 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
                <Bot size={16} />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white leading-none">CA Practice Copilot</h3>
                <p className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Practice Workspace Active
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setApiKeyModalOpen(true)}
                className={`p-1.5 rounded-lg transition-colors ${nvidiaApiKey ? 'text-emerald-400 hover:bg-emerald-500/10' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                title="API Settings"
              >
                <Key size={14} />
              </button>
              <button
                onClick={handleClearChat}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                title="Clear Chat"
              >
                <Trash2 size={14} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Close"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Quick Action Chips */}
          <div className="px-3 py-2 bg-slate-900/40 border-b border-slate-800/40 flex items-center gap-1.5 overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {quickActions.map((qa, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(undefined, qa.prompt)}
                className="whitespace-nowrap flex items-center gap-1 text-[10.5px] font-medium px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-blue-600/30 text-slate-300 hover:text-blue-200 border border-slate-700/60 hover:border-blue-500/40 transition-all shrink-0 active:scale-95"
              >
                <qa.icon size={11} className="text-blue-400" />
                {qa.label}
              </button>
            ))}
          </div>

          {/* Messages Container */}
          <div 
            className="flex-1 p-3.5 overflow-y-auto space-y-3.5 text-xs" 
            style={{ scrollbarWidth: 'thin', scrollbarColor: '#334155 transparent' }}
          >
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center text-white shrink-0 mt-0.5 shadow-sm">
                    <Bot size={13} />
                  </div>
                )}

                <div className="max-w-[84%] space-y-1.5">
                  <div className={`p-3 rounded-xl leading-relaxed text-xs ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-none shadow-sm'
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none shadow-sm'
                  }`}>
                    <div className="whitespace-pre-wrap break-words">
                      {msg.content.split('\n').map((line, lIdx) => (
                        <p key={lIdx} className="my-0.5">
                          {line.split(/(\*\*.*?\*\*)/g).map((part, pIdx) => {
                            if (part.startsWith('**') && part.endsWith('**')) {
                              return <strong key={pIdx} className="font-semibold text-white">{part.slice(2, -2)}</strong>;
                            }
                            return part;
                          })}
                        </p>
                      ))}
                    </div>

                    {msg.role === 'assistant' && (
                      <div className="mt-2 pt-1.5 border-t border-slate-800/60 flex items-center justify-between text-[9.5px] text-slate-500">
                        <span>{msg.timestamp}</span>
                        <button
                          onClick={() => handleCopy(msg.id, msg.content)}
                          className="hover:text-slate-300 p-0.5 rounded transition-colors"
                          title="Copy"
                        >
                          {copiedId === msg.id ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Action Confirmation Card */}
                  {msg.actionCard && (
                    <div className="p-2.5 rounded-lg bg-blue-950/40 border border-blue-500/30 text-white space-y-1">
                      <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-blue-300">
                        <Sparkles size={12} className="text-blue-400" />
                        {msg.actionCard.title}
                      </div>
                      <p className="text-[10px] text-slate-400">{msg.actionCard.subtitle}</p>
                      {msg.actionCard.downloadFilename && (
                        <button
                          onClick={() => triggerDownload(msg.actionCard!.downloadFilename!, msg.actionCard!.downloadContent!)}
                          className="w-full mt-1.5 py-1 px-2 rounded bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-semibold flex items-center justify-center gap-1 transition-colors"
                        >
                          <Download size={11} /> Download CSV
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {msg.role === 'user' && (
                  <div className="w-6 h-6 rounded-md bg-slate-800 flex items-center justify-center text-slate-300 shrink-0 mt-0.5 border border-slate-700">
                    <User size={13} />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2 justify-start items-center">
                <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center text-white shrink-0">
                  <Bot size={13} />
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 text-[11px] flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" />
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce delay-150" />
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce delay-300" />
                  <span>Reasoning & executing in workspace...</span>
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          {/* Clean Input Bar */}
          <form onSubmit={handleSendMessage} className="p-2.5 bg-slate-900/90 border-t border-slate-800 flex items-center gap-1.5">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask or command: 'Add client', 'Export CSV'..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder:text-slate-500 outline-none focus:border-blue-500 transition-colors"
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white transition-all shrink-0"
              title="Send"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      )}

      {/* API Key Modal */}
      {apiKeyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-5 text-white shadow-2xl space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <Cpu size={16} className="text-blue-400" />
                <h3 className="text-xs font-bold">AI Engine Settings</h3>
              </div>
              <button onClick={() => setApiKeyModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={16} />
              </button>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              Your API Key is connected and ready for real-time tool calling across your practice workspace.
            </p>

            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-300">API Key</label>
              <input
                type="password"
                value={tempApiKey}
                onChange={(e) => setTempApiKey(e.target.value)}
                placeholder="nvapi-..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-slate-600 outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setApiKeyModalOpen(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-[11px] font-medium text-slate-300 hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => saveApiKey(tempApiKey)}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-[11px] font-semibold text-white transition-colors"
              >
                Save Key
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
