import React from 'react';
import { User } from '@/types';
import { Card } from '@/components/ca/ui';
import { BookOpen, Users, CheckSquare, FileText, UserPlus, Shield, Activity, UploadCloud, Bot } from 'lucide-react';

const Help: React.FC<{ user: User }> = ({ user }) => {
  const isAdminOrManager = user.role === 'admin' || user.role === 'manager';

  const GuideSection = ({ title, icon: Icon, color, children }: { title: string; icon: any; color: string; children: React.ReactNode }) => (
    <Card className={`border-l-4 ${color} shadow-md hover:shadow-lg transition-shadow duration-300`}>
      <div className="flex items-center gap-3 mb-4 border-b border-gray-100 pb-3">
        <div className={`p-2 rounded-lg bg-gray-50 ${color.replace('border-', 'text-')}`}>
          <Icon size={24} />
        </div>
        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
      </div>
      <div className="space-y-3 text-gray-600">
        {children}
      </div>
    </Card>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10 animate-fade-in">

      {/* Header */}
      <div className="text-center space-y-4 mb-10">
        <h1 className="text-4xl font-display font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700 inline-block">
          App Documentation
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto text-lg">
          Master the CA Firm Workspace with this comprehensive guide tailored for your role.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* ==================== MANAGER / ADMIN SECTION ==================== */}
        {isAdminOrManager && (
          <>
            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Shield className="text-blue-600" /> Administrative Controls
              </h2>
            </div>

            <GuideSection title="AI Smart Assistant" icon={Bot} color="border-rose-500">
              <p className="mb-2">Your intelligent co-pilot for firm management.</p>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li><strong>Natural Language:</strong> Simply type commands like "Add a new client named TechCorp" or "Create a task for Audit".</li>
                <li><strong>Data Insights:</strong> Ask questions like "How many tasks are overdue?" or "Show me John's progress".</li>
                <li><strong>Automation:</strong> Let the AI handle repetitive data entry and status updates for you.</li>
              </ul>
            </GuideSection>

            <GuideSection title="Client Management" icon={Users} color="border-blue-500">
              <p className="mb-2">Centralize your client database for easy access.</p>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li><strong>Add Clients:</strong> Navigate to <em>Clients</em> and click the "Add Client" button.</li>
                <li><strong>Details:</strong> Store GSTIN, PAN, and contact details securely.</li>
                <li><strong>Status:</strong> Mark clients as Active/Inactive to filter your view.</li>
              </ul>
            </GuideSection>

            <GuideSection title="Task Assignment" icon={CheckSquare} color="border-indigo-500">
              <p className="mb-2">Distribute work efficiently across your team.</p>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li><strong>Create Task:</strong> Go to <em>All Tasks</em> &rarr; "Create Task".</li>
                <li><strong>Assign:</strong> Select a Client and assign to one or multiple Employees.</li>
                <li><strong>Priority:</strong> Set Due Dates to highlight urgent work.</li>
              </ul>
            </GuideSection>

            <GuideSection title="Staff Management" icon={UserPlus} color="border-purple-500">
              <p className="mb-2">Manage your workforce access and roles.</p>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li><strong>Onboarding:</strong> Create employee accounts with secure login codes.</li>
                <li><strong>Roles:</strong> Assign roles (Manager/Staff) to control access levels.</li>
                <li><strong>Monitoring:</strong> Track task completion rates per employee.</li>
              </ul>
            </GuideSection>

            <GuideSection title="Invoicing & Finance" icon={FileText} color="border-emerald-500">
              <p className="mb-2">Track billings and revenue.</p>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li><strong>Generate Invoices:</strong> Create professional invoices linked to specific Tasks.</li>
                <li><strong>Status Tracking:</strong> Monitor Paid/Unpaid/Overdue statuses.</li>
                <li><strong>Export:</strong> Download invoice data for your own accounting.</li>
              </ul>
            </GuideSection>
          </>
        )}

        {/* ==================== EMPLOYEE SECTION ==================== */}
        <div className="md:col-span-2 mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <BookOpen className="text-green-600" /> Employee Handbook
          </h2>
        </div>

        <GuideSection title="Managing My Work" icon={Activity} color="border-orange-500">
          <p className="mb-2">Stay on top of your assigned responsibilities.</p>
          <ul className="list-disc pl-5 space-y-2 text-sm">
            <li><strong>My Tasks:</strong> Check the "My Tasks" page daily for new assignments.</li>
            <li><strong>Updates:</strong> Change status (e.g., "In Progress") to keep managers informed.</li>
            <li><strong>Filters:</strong> Use filters to see what's "Pending" or "Due Soon".</li>
          </ul>
        </GuideSection>

        <GuideSection title="Documents & Evidence" icon={UploadCloud} color="border-cyan-500">
          <p className="mb-2">Maintain a digital trail of your work.</p>
          <ul className="list-disc pl-5 space-y-2 text-sm">
            <li><strong>Uploads:</strong> Attach working papers, scanned copies, or Excel sheets directly to tasks.</li>
            <li><strong>Access:</strong> View client documents uploaded by the manager.</li>
            <li><strong>Security:</strong> All files are stored securely in the cloud.</li>
          </ul>
        </GuideSection>

      </div>

      {/* Footer Info */}
      <div className="mt-12 p-6 bg-slate-100 rounded-xl text-center border border-slate-200">
        <h4 className="font-semibold text-slate-700">Need Specialized Help?</h4>
        <p className="text-slate-500 text-sm mt-2">
          Contact your System Administrator for account issues.
        </p>
        <p className="text-xs text-slate-400 mt-4">CA Firm Workspace v1.2.0 • Build 2024</p>
      </div>

    </div>
  );
};

export default Help;
