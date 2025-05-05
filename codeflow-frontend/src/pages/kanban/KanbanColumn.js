import React, { useState } from 'react';
import { Plus, Search, ChevronLeft, ChevronRight, X } from 'lucide-react';
import Task from './Task';
import { useDroppable } from '@dnd-kit/core';


export function KanbanColumn({ title, tasks, onAddTask, onDeleteTask }) {
	const { setNodeRef } = useDroppable({
		id: title,
	});
	const [isAddingTask, setIsAddingTask] = useState(false);
	const [newTaskTitle, setNewTaskTitle] = useState('');
	const [newTaskDescription, setNewTaskDescription] = useState('');

	const handleAddTask = () => {
		if (newTaskTitle.trim()) {
			onAddTask(newTaskTitle.trim(), newTaskDescription.trim(), title);
			setNewTaskTitle('');
			setNewTaskDescription('');
			setIsAddingTask(false);
		}
	};

	const handleKeyPress = (e) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleAddTask();
		}
	};

	return (
		<div className="flex flex-col h-full">
			<div className="flex items-center justify-between mb-2">
				<div className="flex items-center gap-2">
					<h3 className="text-sm font-medium">{title}</h3>
					{tasks.length > 0 && (
						<span className="text-xs text-gray-400">{tasks.length}</span>
					)}
				</div>
				<div className="flex items-center gap-1">
					<button className="p-1 hover:bg-[#3D3D3D] rounded">
						<ChevronLeft size={16} className="text-gray-400" />
					</button>
					<button className="p-1 hover:bg-[#3D3D3D] rounded">
						<ChevronRight size={16} className="text-gray-400" />
					</button>
				</div>
			</div>

			<div className="flex items-center gap-2 mb-4">
				<button
					className="flex items-center gap-1 text-sm text-white bg-[#3D3D3D] hover:bg-[#4D4D4D] px-3 py-1.5 rounded"
					onClick={() => setIsAddingTask(!isAddingTask)}
				>
					{isAddingTask ? <X size={16} /> : <Plus size={16} />}
					{isAddingTask ? 'Cancel' : 'New item'}
				</button>
				<div className="relative flex-1">
					<Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
					<input
						type="text"
						className="w-full bg-[#3C3C3C] border border-[#444] rounded pl-8 pr-2 py-1 text-sm focus:outline-none focus:border-[#0078D4]"
						placeholder="Search"
					/>
				</div>
			</div>

			<div
				ref={setNodeRef}
				className="flex-1 bg-[#2D2D2D] rounded-lg min-h-[200px] p-2"

			>
				{isAddingTask && (
					<div className="bg-[#1E1E1E] p-2 rounded mb-2">
						<div className="flex flex-col gap-2">
							<input
								type="text"
								className="w-full bg-[#3C3C3C] border border-[#0078D4] rounded px-3 py-1.5 text-sm focus:outline-none"
								placeholder="Enter task title"
								value={newTaskTitle}
								onChange={(e) => setNewTaskTitle(e.target.value)}
								onKeyPress={handleKeyPress}
								autoFocus
							/>
							<textarea
								className="w-full bg-[#3C3C3C] border border-[#444] rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#0078D4] min-h-[60px] resize-none"
								placeholder="Enter task description (optional)"
								value={newTaskDescription}
								onChange={(e) => setNewTaskDescription(e.target.value)}
							/>
							<button
								className="bg-[#0078D4] hover:bg-[#106EBE] px-4 py-1.5 rounded text-sm w-full"
								onClick={handleAddTask}
							>
								Add to top
							</button>
						</div>
					</div>
				)}

				{tasks.map((task, index) => (
					<Task id={task._id} title={task.title} description={task.description} status={task.status} onDeleteTask={onDeleteTask} key={index} />
				))}
			</div>

		</div>
	);
}