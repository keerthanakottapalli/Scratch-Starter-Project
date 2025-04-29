// PreviewArea.js
import React from 'react';
import CatSprite from './CatSprite';

export default function PreviewArea({ sprites, setSprites, playAnimations }) {
  const selectSprite = (id) => {
    setSprites(sprites.map(sprite => ({
      ...sprite,
      isActive: sprite.id === id
    })));
  };

  return (
    <div className="h-full p-4 bg-gray-50">
      <button 
        onClick={playAnimations}
        className="w-full mb-4 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
      >
        Play
      </button>
      
      <div className="relative h-full border-2 border-dashed border-gray-300 rounded-lg">
        {sprites.map(sprite => (
          <div 
            key={sprite.id}
            className={`absolute cursor-pointer transition-all duration-300 ${
              sprite.isActive ? 'ring-2 ring-blue-500' : ''
            }`}
            style={{
              left: `${sprite.x}px`,
              top: `${sprite.y}px`,
              transform: `rotate(${sprite.rotation}deg)`,
              transition: 'all 0.5s ease'
            }}
            onClick={() => selectSprite(sprite.id)}
          >
            <CatSprite />
            <div className="text-xs bg-white px-2 py-1 rounded mt-1 text-center">
              {sprite.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}