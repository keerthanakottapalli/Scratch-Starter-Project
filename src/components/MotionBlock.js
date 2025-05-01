// MotionBlock.js
import React, { useState, useRef, useEffect } from 'react';
import { useDrag } from 'react-dnd';

export default function MotionBlock({ command, className }) {
    const [params, setParams] = useState({
        move: { steps: 10 },
        turn: { degrees: 15 },
        goto: { x: 0, y: 0 },
        say: { text: 'Hello!', seconds: 2 },
        think: { text: 'Hmm...', seconds: 2 },
        repeat: { count: 2 }
    }[command]);

    const paramsRef = useRef(params);
    useEffect(() => {
        paramsRef.current = params;
    }, [params]);

    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'block',
        item: () => ({ command, params: paramsRef.current }), // Use current params
        collect: monitor => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    const handleParamChange = (key, value) => {
        setParams(prev => ({
            ...prev,
            [key]: isNaN(value) ? value : Number(value)
        }));
    };

    const renderInputs = () => {
        switch (command) {
            case 'move':
                return (
                    <input
                        type="number"
                        value={params.steps}
                        onChange={(e) => handleParamChange('steps', e.target.value)}
                        className="w-12 ml-2 px-1 py-0.5 border rounded text-gray-800 bg-white focus:ring-1 focus:ring-blue-300 text-sm h-7"
                    />
                );
            case 'turn':
                return (
                    <input
                        type="number"
                        value={params.degrees}
                        onChange={(e) => handleParamChange('degrees', e.target.value)}
                        className="w-12 ml-2 px-1 py-0.5 border rounded text-gray-800 bg-white focus:ring-1 focus:ring-blue-300 text-sm h-7"
                    />
                );
            case 'goto':
                return (
                    <div className="flex space-x-1 items-center">
                        <span className="text-sm">X:</span>
                        <input
                            type="number"
                            value={params.x}
                            onChange={(e) => handleParamChange('x', e.target.value)}
                            className="w-10 px-1 py-0.5 border rounded text-gray-800 bg-white focus:ring-1 focus:ring-blue-300 text-sm h-7"
                        />
                        <span className="text-sm">Y:</span>
                        <input
                            type="number"
                            value={params.y}
                            onChange={(e) => handleParamChange('y', e.target.value)}
                            className="w-10 px-1 py-0.5 border rounded text-gray-800 bg-white focus:ring-1 focus:ring-blue-300 text-sm h-7"
                        />
                    </div>
                );
            case 'say':
            case 'think':
                return (
                    <div className="flex flex-row">
                        <div className="mb-1">
                            <input
                                type="text"
                                value={params.text}
                                onChange={(e) => handleParamChange('text', e.target.value)}
                                className="w-full px-2 py-1 border rounded text-gray-800 bg-white focus:ring-1 focus:ring-blue-300 text-sm h-7"
                                placeholder={command === 'say' ? "What to say..." : "What to think..."}
                            />
                        </div>
                        <div className="flex items-center space-x-1">
                            <span className="text-xs text-white-800">for</span>
                            <input
                                type="number"
                                min="0"
                                value={params.seconds}
                                onChange={(e) => handleParamChange('seconds', e.target.value)}
                                className="w-12 px-1 py-0.5 border rounded text-gray-800 bg-white focus:ring-1 focus:ring-blue-300 text-sm h-7"
                            />
                            <span className="text-xs text-white-800">sec</span>
                        </div>
                    </div>
                );
            case 'repeat':
                return (
                    <div className="flex flex-col border-l-4 border-yellow-500 pl-2">
                        <div className="flex items-center">
                            <input
                                type="number"
                                min="1"
                                value={params.count}
                                onChange={(e) => handleParamChange('count', Math.max(1, e.target.value))}
                                className="w-10 px-1 py-0.5 mx-2 border rounded text-gray-800 bg-white focus:ring-1 focus:ring-blue-300 text-sm h-7"
                            />
                            <span className="text-sm">times</span>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };
    return (
        <div
            ref={drag}
            className={`p-3 mb-3 rounded-xl cursor-move shadow-md transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.97] ${className} ${isDragging ? 'opacity-40' : 'opacity-100'}`}
        >
            <div className="flex items-center">
                <span className="font-medium">
                    {command === 'move' && 'Move'}
                    {command === 'turn' && 'Turn'}
                    {command === 'goto' && 'Go to'}
                    {command === 'say' && 'Say'}
                    {command === 'think' && 'Think'}
                    {command === 'repeat' && 'Repeat'}
                </span>
                {renderInputs()}
            </div>
        </div>
    );
}