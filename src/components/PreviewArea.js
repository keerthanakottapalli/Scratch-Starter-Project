import React from 'react';
import CatSprite from './CatSprite';
import {
  PlayCircle,
  StopCircle,
  Star,
  PlusCircle,
  Trash2
} from 'lucide-react';


export default function PreviewArea({
  sprites,
  setSprites,
  playAnimations,
  stopAnimations,
  addSprite,
  removeSprite,
  heroMode,
  setHeroMode
}) {
  const selectSprite = (id) => {
    setSprites(prev => prev.map(sprite => ({
      ...sprite,
      isActive: sprite.id === id
    })));
  };

  const bringToFront = (id) => {
    setSprites(prev => {
      const sprite = prev.find(s => s.id === id);
      if (!sprite) return prev;
      return [
        ...prev.filter(s => s.id !== id),
        { ...sprite, isActive: true }
      ];
    });
  };

  return (
    <div className="flex-1 h-full p-4 relative">
      {/* Playground */}
      <div className="relative h-full border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
        {sprites.map(sprite => (
          <div
            key={sprite.id}
            className={`absolute cursor-move transition-all duration-300 ${sprite.isActive ? 'ring-2 ring-blue-500' : ''
              } ${sprite.isFlashing ? 'bg-yellow-100 bg-opacity-50' : ''}`}
            style={{
              left: `${sprite.x}px`,
              top: `${sprite.y}px`,
              transform: `rotate(${sprite.rotation}deg)`,
              zIndex: sprite.isActive ? 10 : 1
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
              selectSprite(sprite.id);
              bringToFront(sprite.id);

              const startX = e.clientX;
              const startY = e.clientY;

              const handleMouseMove = (moveEvent) => {
                const dx = moveEvent.clientX - startX;
                const dy = moveEvent.clientY - startY;

                setSprites(prev =>
                  prev.map(s =>
                    s.id === sprite.id
                      ? { ...s, x: sprite.x + dx, y: sprite.y + dy }
                      : s
                  )
                );
              };

              const handleMouseUp = () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
              };

              document.addEventListener('mousemove', handleMouseMove);
              document.addEventListener('mouseup', handleMouseUp);
            }}
          >
            <CatSprite />
            <div className="text-xs bg-white px-2 py-1 rounded mt-1 text-center">
              {sprite.name}
              {sprite.animations.some(a => a.command === 'move' && a.params.steps > 0) && ' →'}
              {sprite.animations.some(a => a.command === 'move' && a.params.steps < 0) && ' ←'}
            </div>

            {sprite.isSpeaking && (
              <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-white p-2 rounded-lg shadow-lg border border-gray-200 max-w-xs w-full">
                <div className="text-sm break-words">{sprite.speechText}</div>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 w-4 h-4 bg-white border-r border-b border-gray-200 rotate-45"></div>
              </div>
            )}
            {sprite.isThinking && (
              <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-white p-2 rounded-full shadow-lg border border-gray-200 max-w-xs">
                <div className="text-sm">{sprite.thoughtText}</div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Floating HUD Panel */}
      <div className="absolute top-4 right-4 z-50 flex flex-col gap-3 p-3 bg-white bg-opacity-90 rounded-xl shadow-lg backdrop-blur-md">
        <button
          onClick={playAnimations}
          className="text-green-600 hover:text-green-800"
          title="Play"
        >
          <PlayCircle size={28} />
        </button>
        <button
          onClick={stopAnimations}
          className="text-red-600 hover:text-red-800"
          title="Stop"
        >
          <StopCircle size={28} />
        </button>
        <button
          onClick={() => setHeroMode(!heroMode)}
          title="Toggle Hero Mode"
          className={`hover:text-purple-700 ${heroMode ? 'text-purple-700 animate-pulse' : 'text-gray-600'}`}
        >
          <Star size={26} />
        </button>
        <button
          onClick={addSprite}
          title="Add Sprite"
          className="text-blue-600 hover:text-blue-800"
        >
          <PlusCircle size={28} />
        </button>
        <button
          onClick={() => removeSprite(sprites.find(s => s.isActive)?.id)}
          title="Remove Sprite"
          className={`hover:text-red-700 ${sprites.length === 0 ? 'text-gray-400 cursor-not-allowed' : 'text-red-600'
            }`}
          disabled={sprites.length === 0}
        >
          <Trash2 size={26} />
        </button>
      </div>
    </div>
  );
}