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
      name: 'Sprite 1',
      rotation: 0,
      animations: [],
      isActive: true,
      isFlashing: false
    }
  ]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [heroMode, setHeroMode] = useState(false);
  const [animationLoop, setAnimationLoop] = useState(null);

  const setActiveSprite = (id) => {
    setSprites(prev => prev.map(sprite => ({
      ...sprite,
      isActive: sprite.id === id
    })));
  };

  const executeAnimation = async (animation, spriteId) => {
    return new Promise(resolve => {
      setSprites(prev => prev.map(sprite => {
        if (sprite.id !== spriteId) return sprite;

        const newState = { ...sprite };
        switch (animation.command) {
          case 'move':
            newState.x += animation.params.steps;
            setTimeout(resolve, 1000);
            break;
          case 'turn':
            newState.rotation += animation.params.degrees;
            setTimeout(resolve, 1000);
            break;
          case 'goto':
            newState.x = animation.params.x;
            newState.y = animation.params.y;
            setTimeout(resolve, 1000);
            break;
          case 'say':
            newState.isSpeaking = true;
            newState.speechText = animation.params.text;
            setTimeout(() => {
              setSprites(prev => prev.map(s =>
                s.id === spriteId ? { ...s, isSpeaking: false } : s
              ));
              resolve();
            }, animation.params.seconds * 1000);
            return newState;
          case 'think':
            newState.isThinking = true;
            newState.thoughtText = animation.params.text;
            setTimeout(() => {
              setSprites(prev => prev.map(s =>
                s.id === spriteId ? { ...s, isThinking: false } : s
              ));
              resolve();
            }, animation.params.seconds * 1000);
            return newState;
          default:
            setTimeout(resolve, 1000);
        }
        return newState;
      }));
    });
  };

  const executeSpriteAnimations = async (sprite) => {
    // Process animations with repeat support
    const processAnimations = async (animations, repeatCount = 1) => {
      for (let i = 0; i < repeatCount; i++) {
        for (let j = 0; j < animations.length; j++) {
          const animation = animations[j];

          if (animation.command === 'repeat') {
            // Find the end of the repeat block
            let endIndex = j + 1;
            while (endIndex < animations.length &&
              animations[endIndex].command !== 'repeat') {
              endIndex++;
            }
            // Process the nested animations
            await processAnimations(
              animations.slice(j + 1, endIndex),
              animation.params.count
            );
            j = endIndex;
          } else {
            await executeAnimation(animation, sprite.id);
          }
        }
      }
    };
    await processAnimations(sprite.animations);
  };

  const executeAnimationFrame = async () => {
    setSprites(prev => {
      prev.forEach(sprite => {
        if (sprite.animations.length === 0) return;
        const animation = sprite.animations[0];
        executeAnimation(animation, sprite.id);
      });
      return [...prev];
    });
  };
  
  const invertMovement = (animations) => {
    return animations.map(animation => {
      if (animation.command === 'move') {
        return {
          ...animation,
          params: {
            ...animation.params,
            steps: -animation.params.steps
          }
        };
      }
      if (animation.command === 'repeat') {
        return {
          ...animation,
          params: {
            ...animation.params,
            animations: invertMovement(animation.params.animations || [])
          }
        };
      }
      return animation;
    });
  };

  const checkCollisions = () => {
    setSprites(prev => {
      const newSprites = [...prev];
      const collisionThreshold = 50;
      let collisionOccurred = false;

      for (let i = 0; i < newSprites.length; i++) {
        for (let j = i + 1; j < newSprites.length; j++) {
          const sprite1 = newSprites[i];
          const sprite2 = newSprites[j];

          const dx = sprite1.x - sprite2.x;
          const dy = sprite1.y - sprite2.y;
          const distance = Math.hypot(dx, dy);

          if (distance < collisionThreshold) {
            collisionOccurred = true;

            if (!sprite1.isFlashing && !sprite2.isFlashing) {
              // Only invert the movement animations
              const tempAnimations = sprite1.animations;

              newSprites[i] = {
                ...sprite1,
                animations: sprite2.animations,
                isFlashing: true
              };

              newSprites[j] = {
                ...sprite2,
                animations: tempAnimations,
                isFlashing: true
              };

            }
          }
        }
      }
      if (collisionOccurred) {
        setTimeout(() => {
          setSprites(prev => prev.map(s => ({
            ...s,
            isFlashing: false
          })));
        }, 300);
      }
      return newSprites;
    });
  };

  const playAnimations = async () => {
    setIsPlaying(true);
    setSprites(prev => prev.map(sprite => ({
      ...sprite,
      isSpeaking: false,
      isThinking: false,
      isFlashing: false
    })));
    if (heroMode) {
      // Create a loop function
      const loop = async () => {
        if (!isPlaying) return;
        await executeAnimationFrame();
        checkCollisions();
        animationLoop = setTimeout(loop, 100);
      };
      setAnimationLoop(loop);
      loop();
    } else {
      // Normal mode
      await Promise.all(
        sprites.map(sprite => executeSpriteAnimations(sprite))
      );
      setIsPlaying(false);
    }
  };

  // Update the stopAnimations function
  const stopAnimations = () => {
    setIsPlaying(false);
    if (animationLoop) {
      clearTimeout(animationLoop);
      setAnimationLoop(null);
    }

    // Reset to initial positions when in hero mode
    if (heroMode) {
      setSprites(prev => prev.map(sprite => ({
        ...sprite,
        x: 100, // Default X position
        y: 100, // Default Y position
        rotation: 0,
        isFlashing: false
      })));
    }
  };

  const SPRITE_SPACING = 120; // distance between sprites

  const addSprite = () => {
    const newId = Date.now();
  
    let baseX = 100;
    let baseY = 100;
  
    if (sprites.length > 0) {
      const lastSprite = sprites[sprites.length - 1]; // 🟢 use the LAST sprite
      baseX = lastSprite.x + SPRITE_SPACING;
      baseY = lastSprite.y;
    }
    setSprites([
      ...sprites,
      {
        id: newId,
        x: baseX,
        y: baseY,
        name: `Sprite ${sprites.length + 1}`,
        rotation: 0,
        animations: [],
        isActive: false,
        isFlashing: false
      }
    ]);
  };
  
  const removeSprite = (id) => {
    if (sprites.length <= 1) return;
    setSprites(sprites.filter(sprite => sprite.id !== id));
  };

  return (
    <div className="bg-blue-100 font-sans">
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
            stopAnimations={stopAnimations}
            addSprite={addSprite}
            removeSprite={removeSprite}
            heroMode={heroMode}
            setHeroMode={setHeroMode}
          />
        </div>
      </div>
    </div>
  );
}