import React from 'react';
import { useDrag } from 'react-dnd';

export default function MotionBlock({ command, onDragStart, className }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'block',
    item: () => {
      const defaultParams = {
        steps: 10,
        degrees: 15,
        x: 0,
        y: 0,
        text: 'Hello',
        seconds: 2,
        count: 2,
        direction: 'right'
      };
      return { command, params: defaultParams };
    },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`p-2 mb-2 rounded cursor-move ${className} ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
      onClick={(e) => {
        const item = {
          command,
          params: {
            steps: 10,
            degrees: 15,
            x: 0,
            y: 0,
            text: 'Hello',
            seconds: 2,
            count: 2,
            direction: 'right'
          }
        };
        onDragStart(e, item);
      }}
    >
      {command === 'move' && 'Move 10 steps'}
      {command === 'turn' && 'Turn 15 degrees'}
      {command === 'goto' && 'Go to x: y:'}
      {command === 'say' && 'Say Hello for 2 seconds'}
      {command === 'think' && 'Think Hmm for 2 seconds'}
      {command === 'repeat' && 'Repeat 2 times'}
    </div>
  );
}