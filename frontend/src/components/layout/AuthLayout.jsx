import React from 'react';
import CosmicBackground from '../common/CosmicBackground';

const AuthLayout = ({ children, title, subtitle, bottomText }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
      <CosmicBackground />
      <div className="w-full max-w-[440px] flex flex-col items-center relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">{title}</h1>
          <p className="text-gray-400 text-lg">{subtitle}</p>
        </div>

        {/* Card */}
        <div className="w-full bg-white dark:bg-gray-900 rounded-[32px] p-8 shadow-2xl transition-colors duration-200">
          {children}
        </div>

        {/* Bottom Text */}
        {bottomText && (
          <p className="mt-8 text-gray-500 dark:text-gray-400 text-sm text-center px-4">
            {bottomText}
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthLayout;
