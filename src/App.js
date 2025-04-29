import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import MidArea from "./components/MidArea";
import PreviewArea from "./components/PreviewArea";

export default function App() {
  const [sprites, setSprites] = useState([
    { 
      id: 1, 
      x: 100, 
      y: 100, 
      name: 'Cat 1', 
      rotation: 0,
      animations: [],
      isActive: true
    }
  ]);

  const [activeSprite, setActiveSprite] = useState(1);

  const addBlockToSprite = (command, spriteId) => {
    setSprites(prev => prev.map(sprite => {
      if (sprite.id === spriteId) {
        return {
          ...sprite,
          animations: [...sprite.animations, { command }]
        };
      }
      return sprite;
    }));
  };

  return (
    <div className="bg-blue-100 pt-6 font-sans">
      <div className="h-screen overflow-hidden flex flex-row">
        <div className="flex-1 h-screen overflow-hidden flex flex-row bg-white border-t border-r border-gray-200 rounded-tr-xl mr-2">
          <Sidebar />
          <MidArea 
            sprites={sprites} 
            setActiveSprite={setActiveSprite}
            addBlockToSprite={addBlockToSprite}
          />
        </div>
        <div className="w-1/3 h-screen overflow-hidden flex flex-row bg-white border-t border-l border-gray-200 rounded-tl-xl ml-2">
          <PreviewArea sprites={sprites} />
        </div>
      </div>
    </div>
  );
}