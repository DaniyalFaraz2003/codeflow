import React, { useState, useEffect } from 'react';
import { KanbanColumn } from './KanbanColumn';
import { DndContext, DragOverlay, pointerWithin } from '@dnd-kit/core';
import Task from './Task';
import api from '../../services/api';
import { useParams } from 'react-router-dom';

export function KanbanBoard() {
	const { projectid, boardid } = useParams(); // Get the project ID from the URL
	const [tasks, setTasks] = useState([]);
	const [activeTask, setActiveTask] = useState(null);


	useEffect(() => {
		const fetchTasks = async () => {
			try {
				const response = await api.get(`/task/${boardid}`);
				console.log(response.data.tasks);
				
				setTasks(response.data.tasks);
			} catch (error) {
				console.error('Error fetching tasks:', error);
			}
		};

		fetchTasks();
	}, []);

	const addTask = async (title, description, status) => {
		try {
			const response = await api.post("/task", {
				title: title,
				description: description,
				status: status,
				kanbanId: boardid,
			});
			const newTask = response.data.task;
			setTasks([...tasks, newTask]);
		} catch (error) {
			console.error('Error adding task:', error);
		}
	};

	const deleteTask = async (taskId) => {
		setTasks(tasks.filter(task => task._id !== taskId));

		try {
			await api.delete(`/task/${taskId}`);
		} catch (error) {
			console.error('Error deleting task:', error);
		}
	};

	const columns = [
		{ title: 'To Do', tasks: tasks.filter(t => t.status === 'To Do') },
		{ title: 'Doing', tasks: tasks.filter(t => t.status === 'Doing') },
		{ title: 'Done', tasks: tasks.filter(t => t.status === 'Done') },
	];

	const handleDragStart = (event) => {
		const { active } = event;
		const draggedTask = tasks.find(task => task._id === active.id);
		setActiveTask(draggedTask);
	};

	const handleDragEnd = async (event) => {
		
		setActiveTask(null);
		const { active, over } = event;

		if (!over) return;

		const activeTaskId = active.id;
		const newStatus = over.id;

		// Don't do anything if dropped in the same column
		const task = tasks.find(t => t._id === activeTaskId);
		if (task.status === newStatus) return;

		// Update the task status
		setTasks(tasks.map(task =>
			task._id === activeTaskId ? { ...task, status: newStatus } : task
		));

		try {
			await api.put(`/task/status/${activeTaskId}`, { status: newStatus });
		} catch (error) {
			console.error('Error updating task status:', error);
		}
	};

	return (
		<DndContext
			onDragStart={handleDragStart}
			onDragEnd={handleDragEnd}
			collisionDetection={pointerWithin}
		>
			<div className="flex-1">
				<div className="grid grid-cols-3 gap-4">
					{columns.map((column) => (
						<KanbanColumn
							key={column.title}
							title={column.title}
							tasks={column.tasks}
							onAddTask={addTask}
							onDeleteTask={deleteTask}
						/>
					))}
				</div>
			</div>

			<DragOverlay>
				{activeTask ?
					<Task
						id={activeTask._id}
						title={activeTask.title}
						description={activeTask.description}
						status={activeTask.status}
						onDeleteTask={deleteTask}
						isDragging={true}
					/> : null}
			</DragOverlay>
		</DndContext>
	);
}