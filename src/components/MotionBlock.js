// MotionBlock.js
import React from 'react';
import { useDrag } from 'react-dnd';

export default function MotionBlock({ command, onDragStart, className }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'block',
    item: () => {
      // Define default parameters for each command
      const params = {
        move: { steps: 10 },
        turn: { degrees: 15 },
        goto: { x: 0, y: 0 },
        say: { text: 'Hello!', seconds: 2 },
        think: { text: 'Hmm...', seconds: 2 },
        repeat: { count: 2 }
      };
      return { command, params: params[command] };
    },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  // Display text based on command
  const blockText = {
    move: 'Move 10 steps',
    turn: 'Turn 15 degrees',
    goto: 'Go to x:0 y:0',
    say: 'Say Hello! for 2 seconds',
    think: 'Think Hmm... for 2 seconds',
    repeat: 'Repeat 2 times'
  }[command];

  return (
    <div
      ref={drag}
      className={`p-2 mb-2 rounded cursor-move ${className} ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
    >
      {blockText}
    </div>
  );
}