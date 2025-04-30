// MidArea.js
import React from 'react';
import { useDrop } from 'react-dnd';

export default function MidArea({ sprites, setSprites }) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'block',
    drop: (item) => {
      setSprites(prevSprites => {
        return prevSprites.map(sprite => {
          if (!sprite.isActive) return sprite;
          
          // Check if this is a duplicate block
          const isDuplicate = sprite.animations.some(anim => 
            anim.command === item.command && 
            JSON.stringify(anim.params) === JSON.stringify(item.params)
          );
          
          if (isDuplicate) return sprite;
          
          return {
            ...sprite,
            animations: [...sprite.animations, item]
          };
        });
      });
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const removeAnimation = (spriteId, index) => {
    setSprites(prev => prev.map(sprite => 
      sprite.id === spriteId
        ? {
            ...sprite,
            animations: sprite.animations.filter((_, i) => i !== index)
          }
        : sprite
    ));
  };

  const getAnimationText = (animation) => {
    switch(animation.command) {
      case 'move':
        return `Move ${animation.params?.steps ?? 10} steps`; // Fallback to default if needed
      case 'turn':
        return `Turn ${animation.params?.degrees ?? 15} degrees`;
      case 'goto':
        return `Go to x:${animation.params?.x ?? 0} y:${animation.params?.y ?? 0}`;
      case 'say':
        return `Say "${animation.params?.text ?? 'Hello!'}" for ${animation.params?.seconds ?? 2}s`;
      case 'think':
        return `Think "${animation.params?.text ?? 'Hmm...'}" for ${animation.params?.seconds ?? 2}s`;
      case 'repeat':
        return `Repeat ${animation.params?.count ?? 2} times`;
      default:
        return animation.command;
    }
  };

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
              <div 
                key={index} 
                className="flex items-center bg-gray-100 p-2 rounded border border-gray-200 text-gray-800"
              >
                <span className="flex-1">{getAnimationText(animation)}</span>
                <button 
                  onClick={() => removeAnimation(sprite.id, index)}
                  className="text-red-500 hover:text-red-700 ml-2"
                >
                  ×
                </button>
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