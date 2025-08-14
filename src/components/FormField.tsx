import React from 'react';

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  error,
  className = ''
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      <label htmlFor={name} className="block text-sm font-semibold text-gray-800">
        {label}
        {required && <span className="text-orange-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full px-4 py-3 border-2 rounded-xl shadow-sm transition-all duration-200 focus:ring-4 focus:ring-orange-200 focus:border-orange-500 hover:border-orange-300 ${
          error 
            ? 'border-red-300 focus:ring-red-200 focus:border-red-500' 
            : 'border-gray-300'
        } ${disabled ? 'bg-gray-50 text-gray-500' : 'bg-white'} font-medium`}
      />
      {error && (
        <p className="text-sm text-red-600 font-medium">{error}</p>
      )}
    </div>
  );
};