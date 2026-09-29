import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Mail, Lock, ArrowRight, Shield, Award, ClipboardList, Eye, EyeOff, CheckCircle2, ShieldCheck } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('emanyahyadev@gmail.com');
  const [password, setPassword] = useState('123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error.message);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const FeatureCard = ({ icon: Icon, title, description }: { icon: any; title: string; description: string }) => (
    <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/10 hover:bg-white/[0.08] hover:border-blue-400/30 transition-all duration-300 group cursor-default">
      <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/25 shrink-0 group-hover:scale-105 transition-transform duration-300">
        <Icon className="w-4 h-4 text-white" />
      </div>
      <div className="min-w-0">
        <h3 className="font-semibold text-white text-xs sm:text-sm tracking-wide group-hover:text-blue-200 transition-colors">{title}</h3>
        <p className="text-slate-300/80 text-[11px] sm:text-xs mt-0.5 leading-relaxed">{description}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#080D1A]">
      {/* Left Panel - Firm Practice Branding Customized around Official CA Logo */}
      <div className="hidden md:flex md:w-full lg:w-1/2 relative overflow-hidden md:min-h-[300px] lg:min-h-screen">
        {/* Background Gradients & Mesh */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#080D1A] via-[#0F172A] to-[#1E293B]" />
        
        {/* Ambient Glows */}
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[550px] h-[550px] bg-blue-600/30 rounded-full blur-[120px] animate-pulse-slow" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[550px] h-[550px] bg-indigo-600/30 rounded-full blur-[120px] animate-pulse-slow delay-1000" />
        </div>

        {/* Decorative Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

        <div className="relative z-10 flex flex-col justify-center p-6 sm:p-8 md:p-12 xl:p-20 w-full">
          {/* Brand Emblem Showcase */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-700 shadow-2xl shadow-blue-500/30 ring-1 ring-white/20 flex items-center justify-center shrink-0">
              <span className="font-display font-extrabold text-2xl text-white tracking-tight">CA</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-display font-extrabold text-white tracking-tight">CA Firm Workspace</h1>
                <span className="text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Enterprise
                </span>
              </div>
              <p className="text-slate-400 text-xs font-medium mt-0.5">Chartered Accountancy, Statutory Audit & Tax Practice</p>
            </div>
          </div>

          <h2 className="text-3xl sm:text-4xl xl:text-5xl font-display font-bold text-white leading-tight mb-4 drop-shadow-lg">
            Practice Management<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-sky-400">
              Operating System
            </span>
          </h2>

          <p className="text-slate-300 text-sm md:text-base mb-8 max-w-lg hidden lg:block leading-relaxed">
            Enterprise workflow management for Chartered Accountants. Real-time client ledger management, tax compliance, SECP statutory filings, and ISA audit tracking.
          </p>

          <div className="space-y-3 hidden lg:block max-w-lg">
            <FeatureCard
              icon={Award}
              title="Statutory & Tax Compliance"
              description="Complete oversight on sales tax, withholding statements, and corporate filings"
            />
            <FeatureCard
              icon={ClipboardList}
              title="Audit Engagement Tracking"
              description="Real-time fieldwork status, working papers, and quality review controls"
            />
            <FeatureCard
              icon={Shield}
              title="Enterprise Grade Security"
              description="Role-based segregation of duties for Partners, Managers, and Staff"
            />
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 hidden lg:flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-medium text-slate-300">
              <ShieldCheck size={14} className="text-emerald-400" />
              PKR Multi-Tier Accounting
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 font-medium text-slate-300">
              <CheckCircle2 size={14} className="text-blue-400" />
              30+ Active Corporate Mandates
            </span>
          </div>
        </div>
      </div>

      {/* Right Panel - Clean Executive Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12 bg-[#080D1A] min-h-[calc(100vh-280px)] md:min-h-0 lg:min-h-screen relative overflow-hidden">
        <div className="w-full max-w-md relative z-10">
          <div className="bg-[#11192C]/95 backdrop-blur-2xl border border-slate-800/80 rounded-3xl p-8 sm:p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] ring-1 ring-white/10 relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Mobile Brand Logo */}
            <div className="md:hidden flex items-center gap-3 mb-6 justify-center">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-700 shadow-md flex items-center justify-center text-white font-bold text-sm">
                CA
              </div>
              <span className="text-lg font-display font-bold text-white">CA Firm Workspace</span>
            </div>

            {/* Card Header */}
            <div className="mb-8 text-center sm:text-left">
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
                Sign In
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm mt-1.5">
                Access your firm practice portal and client workspaces
              </p>
            </div>

            {/* Clean Professional Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-xs font-semibold text-slate-300 ml-0.5">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                    placeholder="name@company.com"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700/60 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-inner"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between ml-0.5">
                  <label htmlFor="password" className="text-xs font-semibold text-slate-300">
                    Password
                  </label>
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); alert("Please contact your firm administrator or practice manager to reset your password."); }}
                    className="text-[11px] text-blue-400 hover:text-blue-300 transition-colors font-medium"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError('');
                    }}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-900/90 border border-slate-700/60 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500 focus:ring-offset-0 focus:ring-offset-slate-900"
                  />
                  <span className="text-xs text-slate-400">Remember this workstation</span>
                </label>
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium rounded-xl animate-in fade-in">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3.5 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-[length:200%_auto] hover:bg-[center_right] shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="text-sm">
                  {isLoading ? 'Authenticating...' : 'Sign In to Portal'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Enterprise Security Footer */}
            <div className="mt-8 pt-5 border-t border-slate-800/80 text-center">
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
                <Shield className="w-3.5 h-3.5 text-emerald-500" />
                <span>256-Bit Encrypted Practice Connection</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
