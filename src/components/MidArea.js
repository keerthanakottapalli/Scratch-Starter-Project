import React from 'react';
import { useDrop } from 'react-dnd';

export default function MidArea({ sprites, setSprites }) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'block',
    drop: (item) => {
      setSprites(prevSprites => {
        return prevSprites.map(sprite => {
          if (!sprite.isActive) return sprite;

          // Assign a unique ID to each dropped block
          const newBlock = {
            ...item,
            id: crypto.randomUUID()
          };

          return {
            ...sprite,
            animations: [...sprite.animations, newBlock]
          };
        });
      });
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const removeAnimation = (spriteId, blockId) => {
    setSprites(prev => prev.map(sprite =>
      sprite.id === spriteId
        ? {
            ...sprite,
            animations: sprite.animations.filter(anim => anim.id !== blockId)
          }
        : sprite
    ));
  };

  const getAnimationText = (animation) => {
    switch (animation.command) {
      case 'move':
        return `Move ${animation.params?.steps ?? 10} steps`;
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
      className={`flex-1 h-full p-6 overflow-auto transition-all duration-300 rounded-xl border-2 ${
        isOver ? 'bg-blue-100 border-blue-400 shadow-lg' : 'bg-white border-slate-300'
      }`}
    >
      {sprites.filter(s => s.isActive).map(sprite => (
        <div key={sprite.id} className="mb-8">
          <h3 className="text-xl font-bold text-slate-700 mb-4 border-b pb-2">
            🧩 {sprite.name}'s Script
          </h3>

          <div className="space-y-3">
            {sprite.animations.map((animation) => (
              <div
                key={animation.id}
                className="flex items-center justify-between bg-purple-100 border border-purple-300 p-3 rounded-lg shadow-sm transition hover:bg-slate-50"
              >
                <span className="flex-1 font-mono text-sm text-slate-800">
                  {getAnimationText(animation)}
                </span>
                <button
                  onClick={() => removeAnimation(sprite.id, animation.id)}
                  className="ml-3 text-red-500 hover:text-red-700 text-lg font-bold"
                >
                  ×
                </button>
              </div>
            ))}
            {sprite.animations.length === 0 && (
              <p className="text-slate-400 italic text-sm mt-4">🧲 Drag blocks here to build your script...</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
