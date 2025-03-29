import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  gradient?: string;
  hover?: boolean;
}

/**
 * A reusable card component with optional gradient and hover effects
 */
const Card: React.FC<CardProps> = ({ 
  children, 
  className = '',
  gradient = 'from-blue-500 to-purple-500',
  hover = true
}) => {
  return (
    <div className="relative group">
      {/* Gradient background effect on hover */}
      <div 
        className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-0 ${hover ? 'group-hover:opacity-5' : ''} rounded-xl transition-opacity duration-300`}
      ></div>
      
      {/* Main card container */}
      <div 
        className={`border border-gray-800 rounded-xl ${hover ? 'hover:border-gray-700' : ''} transition-colors duration-300 ${className}`}
      >
        {children}
      </div>
    </div>
  );
};

export default Card;