import React from 'react';
import MotionBlock from './MotionBlock';

export default function Sidebar() {
  const handleDragStart = (e, item) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(item));
    e.dataTransfer.effectAllowed = 'copy';
    e.currentTarget.style.opacity = '0.4'; // Visual feedback
  };

  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = '1';
  };

  return (
    <div className="w-60 h-full overflow-y-auto p-4 bg-gray-100">
      <div className="mb-6">
        <h3 className="font-bold text-gray-700 mb-2">Motion</h3>
        <MotionBlock 
          command="move" 
          onDragStart={handleDragStart}
          className="bg-blue-500 text-white"
        />
        <MotionBlock 
          command="turn" 
          onDragStart={handleDragStart}
          className="bg-blue-500 text-white"
        />
        <MotionBlock 
          command="goto" 
          onDragStart={handleDragStart}
          className="bg-blue-500 text-white"
        />
      </div>
      
      <div className="mb-6">
        <h3 className="font-bold text-gray-700 mb-2">Looks</h3>
        <MotionBlock 
          command="say" 
          onDragStart={handleDragStart}
          className="bg-purple-500 text-white"
        />
        <MotionBlock 
          command="think" 
          onDragStart={handleDragStart}
          className="bg-purple-500 text-white"
        />
      </div>
      
      <div className="mb-6">
        <h3 className="font-bold text-gray-700 mb-2">Control</h3>
        <MotionBlock 
          command="repeat" 
          onDragStart={handleDragStart}
          className="bg-yellow-500 text-white"
        />
      </div>
    </div>
  );
}