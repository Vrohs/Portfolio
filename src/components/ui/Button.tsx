import React, { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}



const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  // Base button styles
  const baseStyles = "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-colors duration-200";
  
  // Size-specific styles
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };
  
  // Variant-specific styles
  const variantStyles = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-700 hover:bg-gray-600 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    success: 'bg-green-600 hover:bg-green-700 text-white',
    warning: 'bg-amber-600 hover:bg-amber-700 text-white',
    ghost: 'bg-transparent hover:bg-gray-800 text-gray-300 hover:text-white border border-gray-700'
  };
  
  // Disabled styles
  const disabledStyles = "opacity-60 cursor-not-allowed";
  
  // Full width styles
  const widthStyles = fullWidth ? 'w-full' : '';
  
  // Combined styles
  const buttonStyles = `
    ${baseStyles} 
    ${sizeStyles[size]} 
    ${variantStyles[variant]} 
    ${disabled || isLoading ? disabledStyles : ''} 
    ${widthStyles} 
    ${className}
  `;
  
  return (
    <button
      className={buttonStyles}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <span className="animate-spin rounded-full h-4 w-4 border-2 border-t-transparent border-current"></span>
      )}
      {!isLoading && leftIcon}
      {children}
      {!isLoading && rightIcon}
    </button>
  );
};

export default Button;