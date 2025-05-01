// Sidebar.js
import React from 'react';
import MotionBlock from './MotionBlock';

export default function Sidebar() {
  return (
    <div className="w-64 h-full overflow-y-auto p-4 bg-gradient-to-b from-slate-200 to-slate-100 shadow-inner border-r border-slate-300">
      <div className="mb-6">
      <h3 className="text-lg font-bold text-slate-700 mb-3 px-2 py-1 bg-white/70 backdrop-blur rounded shadow-sm border-l-4 border-blue-400">Motion</h3>
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
      <h3 className="text-lg font-bold text-slate-700 mb-3 px-2 py-1 bg-white/70 backdrop-blur rounded shadow-sm border-l-4 border-purple-400">Looks</h3>
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
      <h3 className="text-lg font-bold text-slate-700 mb-3 px-2 py-1 bg-white/70 backdrop-blur rounded shadow-sm border-l-4 border-yellow-400">Repeat</h3>
      <MotionBlock 
          command="repeat"
          className="bg-yellow-500 text-white"
        />
      </div>
    </div>
  );
}