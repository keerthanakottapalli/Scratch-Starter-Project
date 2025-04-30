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
    setSprites(prev => prev.map(sprite => ({
      ...sprite,
      isSpeaking: false,
      isThinking: false
    })));
  };
  const executeAnimation = async (animation, spriteId) => {
    return new Promise(resolve => {
      setSprites(prev => prev.map(sprite => {
        if (sprite.id !== spriteId) return sprite;
        
        const newState = {...sprite};
        switch(animation.command) {
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
                s.id === spriteId ? {...s, isSpeaking: false} : s
              ));
              resolve();
            }, animation.params.seconds * 1000);
            return newState;
          case 'think':
            newState.isThinking = true;
            newState.thoughtText = animation.params.text;
            setTimeout(() => {
              setSprites(prev => prev.map(s => 
                s.id === spriteId ? {...s, isThinking: false} : s
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
  
  const playAnimations = async () => {
    setIsPlaying(true);
    const activeSprite = sprites.find(s => s.isActive);
    
    if (!activeSprite) {
      setIsPlaying(false);
      return;
    }
  
    // Reset all speech/thought bubbles
    setSprites(prev => prev.map(sprite => ({
      ...sprite,
      isSpeaking: false,
      isThinking: false
    })));
  
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
            await executeAnimation(animation, activeSprite.id);
          }
        }
      }
    };
  
    await processAnimations(activeSprite.animations);
    setIsPlaying(false);
  };

  const addSprite = () => {
    const newId = Date.now();
    setSprites([
      ...sprites,
      {
        id: newId,
        x: Math.random() * 300,
        y: Math.random() * 300,
        name: `Cat ${sprites.length + 1}`,
        rotation: 0,
        animations: [],
        isActive: false,
        isSpeaking: false,
        isThinking: false,
        speechText: '',
        thoughtText: ''
      }
    ]);
    setActiveSprite(newId);
  };

  const removeSprite = (id) => {
    if (sprites.length <= 1) return; // Keep at least one sprite
    setSprites(sprites.filter(sprite => sprite.id !== id));
    if (sprites.find(s => s.id === id)?.isActive) {
      setActiveSprite(sprites[0].id);
    }
  };

  // Update the App.js return statement to pass new props:

  return (
    <div className="bg-blue-100  font-sans">
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
            addSprite={addSprite}
            removeSprite={removeSprite}
          />
        </div>
      </div>
    </div>
  );
}