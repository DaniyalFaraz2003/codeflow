import React from "react";
import { AlertCircle, Trash2, GripVertical } from "lucide-react";
import { useDraggable } from '@dnd-kit/core';

const Task = ({ id, title, description, status, onDeleteTask, isDragging }) => {
    const { attributes, listeners, setNodeRef, isDragging: dragging } = useDraggable({
        id: id,
    });
    
    const isCurrentlyDragging = isDragging || dragging;
    
    return (
        <div
            ref={setNodeRef}
            key={id}
            className={`bg-[#1E1E1E] p-3 rounded mb-2 border-l-4 border-green-500 hover:bg-[#2D2D2D] group ${isCurrentlyDragging ? 'opacity-50' : ''}`}
        >
            <div className="flex items-start gap-2">
                {/* Dedicated drag handle */}
                <div 
                    {...listeners} 
                    {...attributes}
                    className="flex-shrink-0 p-1 hover:bg-[#3D3D3D] rounded cursor-grab mt-0.5"
                >
                    <GripVertical size={14} className="text-gray-400" />
                </div>
                
                <AlertCircle size={16} className="text-green-500 mt-1 flex-shrink-0" />
                
                <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                        <div className="text-sm font-medium">{title}</div>
                        <button
                            onClick={() => onDeleteTask(id)}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-[#3D3D3D] rounded transition-opacity"
                        >
                            <Trash2 size={14} className="text-gray-400" />
                        </button>
                    </div>
                    {description && (
                        <div className="text-xs text-gray-400 mt-1">{description}</div>
                    )}
                    <div className="text-xs text-gray-500 mt-1">{status}</div>
                </div>
            </div>
        </div>
    );
};

export default Task;