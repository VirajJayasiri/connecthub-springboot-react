import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Input = ({
  label,
  icon: Icon,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  name,
  required = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 ml-1">
          {label}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 group-focus-within:text-black dark:group-focus-within:text-white transition-colors">
            <Icon size={20} />
          </div>
        )}
        <input
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`
            w-full py-3 px-4 rounded-xl border transition-all duration-200 outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
            ${Icon ? 'pl-11' : 'pl-4'}
            ${isPassword ? 'pr-11' : 'pr-4'}
            ${error 
              ? 'border-red-500 bg-red-50 focus:ring-1 focus:ring-red-500' 
              : 'border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 focus:border-gray-900 dark:focus:border-gray-600 focus:ring-1 focus:ring-gray-900 dark:focus:ring-gray-600'}
          `}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-500 ml-1">{error}</p>}
    </div>
  );
};

export default Input;
