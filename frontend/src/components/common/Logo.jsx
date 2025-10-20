import React from 'react';
import { Link } from 'react-router-dom';

const Logo = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  return (
    <Link 
      to="/" 
      className={`flex items-center space-x-3 no-underline hover:no-underline ${className}`}
    >
      <div className={sizeClasses[size]}>
        <img 
          src="https://i.pinimg.com/originals/86/9f/b0/869fb06135a2dc55e520ce34cfe6c385.jpg" 
          alt="Logo Gazoduc Invest" 
          className="h-full w-full object-contain rounded-full"
        />
      </div>
      <span className="text-lg font-bold text-primary-300 underline decoration-primary-300 decoration-2">
        Gazoduc Invest.
      </span>
    </Link>
  );
};

export default Logo;
