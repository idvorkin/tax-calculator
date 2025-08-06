import React from 'react';
import { formatK } from '../lib/formatters.js';

const Slider = ({ label, value, onChange, min, max, step = 10000, helper }) => {
  const percentage = ((value - min) / (max - min)) * 100;
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <input
          type="text"
          value={value.toLocaleString()}
          onChange={(e) => {
            const val = parseInt(e.target.value.replace(/,/g, '')) || 0;
            onChange(Math.min(max, Math.max(min, val)));
          }}
          className="w-32 px-2 py-1 text-right border rounded-md"
        />
      </div>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${percentage}%, #E5E7EB ${percentage}%, #E5E7EB 100%)`
          }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        <span>${formatK(min)}</span>
        {helper && <span className="text-center italic">{helper}</span>}
        <span>${formatK(max)}</span>
      </div>
    </div>
  );
};

export default Slider;