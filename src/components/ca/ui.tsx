import React from 'react';
import { cn } from '@/lib/utils';

export const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'premium' }>(
  ({ className, variant = 'primary', ...props }, ref) => {
    const variants = {
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      danger: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm',
      outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
      premium: 'bg-gradient-to-r from-blue-600 via-violet-600 to-blue-600 text-white border-0 animate-gradient-x shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50'
    };
    return (
      <button
        ref={ref}
        className={cn('px-4 py-2 rounded-lg font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-sm', variants[variant], className)}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn('w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2', className)}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement> & { options: { value: string; label: string }[] }>(
  ({ className, options, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn('w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white', className)}
        {...props}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    );
  }
);
Select.displayName = 'Select';

export const Label = ({ children, className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) => (
  <label className={cn('block text-sm font-medium text-gray-700 mb-1', className)} {...props}>
    {children}
  </label>
);

export const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn('bg-white rounded-xl shadow-sm border border-slate-100 p-6', className)}>
    {children}
  </div>
);

export const Badge = ({ children, color = 'gray', className }: { children: React.ReactNode, color?: 'green' | 'red' | 'yellow' | 'blue' | 'gray', className?: string }) => {
  const colors = {
    green: 'bg-green-100 text-green-800',
    red: 'bg-red-100 text-red-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    blue: 'bg-blue-100 text-blue-800',
    gray: 'bg-slate-100 text-slate-800',
  };
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-transparent', colors[color], className)}>
      {children}
    </span>
  );
};

export const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500 text-2xl leading-none">&times;</button>
        </div>
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
};
