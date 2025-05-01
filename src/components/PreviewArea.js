import React from 'react';
import CatSprite from './CatSprite';

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
    <div className="flex-1 h-full p-4">
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={playAnimations}
          className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
        >
          Play
        </button>
        <button
          onClick={stopAnimations}
          className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
        >
          Stop
        </button>
        <button
          onClick={() => setHeroMode(!heroMode)}
          className={`flex-1 ${heroMode ? 'bg-purple-600' : 'bg-gray-500'} text-white py-2 px-4 rounded`}
        >
          {heroMode ? 'Hero Mode ON' : 'Hero Mode OFF'}
        </button>
        <button
          onClick={addSprite}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        >
          Add Sprite
        </button>
        <button
          onClick={() => removeSprite(sprites.find(s => s.isActive)?.id)}
          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
          disabled={sprites.length <= 1}
        >
          Remove
        </button>
      </div>

      <div className="relative h-full border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
        {sprites.map(sprite => (
          <div
  key={sprite.id}
  className={`absolute cursor-pointer transition-all duration-300 ${
    sprite.isActive ? 'ring-2 ring-blue-500' : ''
  } ${
    sprite.isFlashing ? 'bg-yellow-100 bg-opacity-50' : ''
  }`}
  style={{
    left: `${sprite.x}px`,
    top: `${sprite.y}px`,
    transform: `rotate(${sprite.rotation}deg)`,
    transition: 'all 0.5s ease',
    zIndex: sprite.isActive ? 10 : 1
  }}
  onClick={() => {
    selectSprite(sprite.id);
    bringToFront(sprite.id);
  }}
>
            <CatSprite />
            <div className="text-xs bg-white px-2 py-1 rounded mt-1 text-center">
              {sprite.name}
              {sprite.animations.some(a => a.command === 'move' && a.params.steps > 0) && ' →'}
              {sprite.animations.some(a => a.command === 'move' && a.params.steps < 0) && ' ←'}
            </div>

            {sprite.isSpeaking && (
              <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-white p-2 rounded-lg shadow-lg border border-gray-200 max-w-xs">
                <div className="text-sm">{sprite.speechText}</div>
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
    </div>
  );
}