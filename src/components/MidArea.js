import React from 'react';
import { useDrop } from 'react-dnd';

export default function MidArea({ sprites, setSprites }) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'block',
    drop: (item) => {
      const activeSprite = sprites.find(s => s.isActive);
      if (activeSprite) {
        setSprites(sprites.map(sprite => 
          sprite.id === activeSprite.id
            ? { ...sprite, animations: [...sprite.animations, item.command] }
            : sprite
        ));
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div 
      ref={drop}
      className={`flex-1 h-full p-4 overflow-auto ${
        isOver ? 'bg-blue-50' : 'bg-white'
      }`}
    >
      {sprites.filter(s => s.isActive).map(sprite => (
        <div key={sprite.id} className="mb-6">
          <h3 className="font-semibold text-gray-700 mb-2">{sprite.name}</h3>
          <div className="space-y-2">
            {sprite.animations.map((animation, index) => (
              <div key={index} className="bg-gray-100 p-2 rounded border border-gray-200">
                {animation}
              </div>
            ))}
            {sprite.animations.length === 0 && (
              <p className="text-gray-500">Drag blocks here</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}