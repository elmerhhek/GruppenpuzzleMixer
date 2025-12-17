import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// --- Button ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
        const variants = {
            primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm',
            secondary: 'bg-slate-800 text-white hover:bg-slate-900 shadow-sm',
            outline: 'border border-slate-300 bg-white hover:bg-slate-50 text-slate-700',
            ghost: 'hover:bg-slate-100 text-slate-600',
            danger: 'bg-red-500 text-white hover:bg-red-600',
        };

        const sizes = {
            sm: 'h-8 px-3 text-xs',
            md: 'h-10 px-4 py-2',
            lg: 'h-12 px-8 text-lg',
        };

        return (
            <button
                ref={ref}
                className={cn(
                    'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:pointer-events-none disabled:opacity-50',
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            />
        );
    }
);
Button.displayName = 'Button';

// --- Input ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { }

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, ...props }, ref) => {
        return (
            <input
                ref={ref}
                className={cn(
                    'flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                    className
                )}
                {...props}
            />
        );
    }
);
Input.displayName = 'Input';

// --- Card ---
export const Card = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn("rounded-xl border border-slate-200 bg-white text-slate-950 shadow-sm", className)} {...props}>
        {children}
    </div>
);

export const CardHeader = ({ className, children }: { className?: string, children: React.ReactNode }) => (
    <div className={cn("flex flex-col space-y-1.5 p-6", className)}>
        {children}
    </div>
);

export const CardTitle = ({ className, children }: { className?: string, children: React.ReactNode }) => (
    <h3 className={cn("font-semibold leading-none tracking-tight", className)}>
        {children}
    </h3>
);

export const CardContent = ({ className, children }: { className?: string, children: React.ReactNode }) => (
    <div className={cn("p-6 pt-0", className)}>
        {children}
    </div>
);
