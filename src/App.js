// App.js
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
  const [isPlaying, setIsPlaying] = useState(false);

  const setActiveSprite = (id) => {
    setSprites(sprites.map(sprite => ({
      ...sprite,
      isActive: sprite.id === id
    })));
  };

  const playAnimations = () => {
    setIsPlaying(true);
    
    // Execute animations in sequence with delays
    let delay = 0;
    const activeSprite = sprites.find(s => s.isActive);
    
    if (activeSprite) {
      activeSprite.animations.forEach((animation, index) => {
        setTimeout(() => {
          setSprites(prev => prev.map(sprite => {
            if (sprite.id !== activeSprite.id) return sprite;
            
            let newX = sprite.x;
            let newY = sprite.y;
            let newRotation = sprite.rotation;
            
            switch(animation.command) {
              case 'move':
                newX += animation.params.steps;
                break;
              case 'turn':
                newRotation += animation.params.degrees;
                break;
              case 'goto':
                newX = animation.params.x;
                newY = animation.params.y;
                break;
              default:
                break;
            }
            
            return { 
              ...sprite, 
              x: newX, 
              y: newY, 
              rotation: newRotation 
            };
          }));
        }, delay);
        
        delay += 1000; // 1 second delay between animations
      });
    }
    
    setTimeout(() => setIsPlaying(false), delay);
  };

  return (
    <div className="bg-blue-100 pt-6 font-sans">
      <div className="h-screen overflow-hidden flex flex-row">
        <div className="flex-1 h-screen overflow-hidden flex flex-row bg-white border-t border-r border-gray-200 rounded-tr-xl mr-2">
          <Sidebar />
          <MidArea 
            sprites={sprites} 
            setActiveSprite={setActiveSprite}
            setSprites={setSprites}
          />
        </div>
        <div className="w-1/3 h-screen overflow-hidden flex flex-row bg-white border-t border-l border-gray-200 rounded-tl-xl ml-2">
          <PreviewArea 
            sprites={sprites} 
            setSprites={setSprites}
            playAnimations={playAnimations}
          />
        </div>
      </div>
    </div>
  );
}