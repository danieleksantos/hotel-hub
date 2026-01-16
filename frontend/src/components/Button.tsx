import React, { type ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ className = '', children, ...props }) => {
  return (
    <button
      className={`
        flex items-center justify-center gap-2
        py-3 px-6 rounded-lg shadow-md
        text-sm font-bold uppercase tracking-wider
        transition-all duration-200
        cursor-pointer
        
        bg-primary text-white border border-transparent
        
        hover:bg-secondary hover:text-primary hover:shadow-xl hover:-translate-y-0.5
        
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary
        
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};