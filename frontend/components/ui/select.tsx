import React, { useState } from "react";

interface SelectProps {
  children: React.ReactNode;
  className?: string;
}

export const Select: React.FC<SelectProps> = ({ children, className }) => {
  return <div className={`relative inline-block w-full ${className}`}>{children}</div>;
};

interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const SelectTrigger: React.FC<SelectTriggerProps> = ({ children, ...props }) => {
  return (
    <button
      {...props}
      className="w-full p-2 border rounded-lg flex justify-between items-center bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {children}
    </button>
  );
};

interface SelectContentProps {
  children: React.ReactNode;
  className?: string;
}

export const SelectContent: React.FC<SelectContentProps> = ({ children, className }) => {
  return (
    <div className={`absolute mt-1 w-full bg-white border rounded-lg shadow-lg z-10 ${className}`}>
      {children}
    </div>
  );
};

interface SelectItemProps {
  value: string;
  onSelect: (value: string) => void;
  children: React.ReactNode;
}

export const SelectItem: React.FC<SelectItemProps> = ({ value, onSelect, children }) => {
  return (
    <div
      onClick={() => onSelect(value)}
      className="p-2 cursor-pointer hover:bg-gray-100"
    >
      {children}
    </div>
  );
};

interface SelectValueProps {
  children: React.ReactNode;
}

export const SelectValue: React.FC<SelectValueProps> = ({ children }) => {
  return <span>{children}</span>;
};
