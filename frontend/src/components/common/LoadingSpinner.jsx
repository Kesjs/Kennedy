import React from 'react';
import { FaSpinner } from 'react-icons/fa';

const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <FaSpinner 
        className={`animate-spin text-blue-500 ${sizeClasses[size] || sizeClasses.md}`} 
        aria-hidden="true"
      />
      <span className="sr-only">Chargement...</span>
    </div>
  );
};

export default LoadingSpinner;
