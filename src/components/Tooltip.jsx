import React from 'react';

const Tooltip = ({ children, text }) => (
  <div className="relative inline-block group">
    {children}
    <div className="absolute z-10 invisible group-hover:visible bg-gray-900 text-white text-sm rounded-lg p-2 bottom-full left-1/2 transform -translate-x-1/2 mb-2 whitespace-nowrap">
      {text}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
        <div className="border-4 border-transparent border-t-gray-900"></div>
      </div>
    </div>
  </div>
);

export default Tooltip;