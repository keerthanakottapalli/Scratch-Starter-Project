// Sidebar.js
import React from 'react';
import MotionBlock from './MotionBlock';

export default function Sidebar() {
  return (
    <div className="w-60 h-full overflow-y-auto p-4 bg-gray-100">
      <div className="mb-6">
        <h3 className="font-bold text-gray-700 mb-2">Motion</h3>
        <MotionBlock 
          command="move"
          className="bg-blue-500 text-white"
        />
        <MotionBlock 
          command="turn"
          className="bg-blue-500 text-white"
        />
        <MotionBlock 
          command="goto"
          className="bg-blue-500 text-white"
        />
      </div>
      
      <div className="mb-6">
        <h3 className="font-bold text-gray-700 mb-2">Looks</h3>
        <MotionBlock 
          command="say"
          className="bg-purple-500 text-white"
        />
        <MotionBlock 
          command="think"
          className="bg-purple-500 text-white"
        />
      </div>
      
      <div className="mb-6">
        <h3 className="font-bold text-gray-700 mb-2">Control</h3>
        <MotionBlock 
          command="repeat"
          className="bg-yellow-500 text-white"
        />
      </div>
    </div>
  );
}