import React, { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  withDot?: boolean;
  icon?: ReactNode;
  className?: string;
}

/**
 * A reusable badge component with variants for different statuses
 */
const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  withDot = false,
  icon,
  className = ''
}) => {
  // Variant-specific styles
  const variantStyles = {
    default: 'bg-gray-500/20 text-gray-400',
    success: 'bg-green-500/20 text-green-400',
    warning: 'bg-amber-500/20 text-amber-400',
    error: 'bg-red-500/20 text-red-400',
    info: 'bg-blue-500/20 text-blue-400'
  };
  
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${variantStyles[variant]} ${className}`}>
      {withDot && (
        <span className={`w-1.5 h-1.5 rounded-full bg-current`}></span>
      )}
      {icon}
      {children}
    </span>
  );
};

export default Badge;