const Task = require("../db/models/task.js");
const mongoose = require("mongoose");
const {
    getTasksByKanbanId,
    create,
    remove,
    updateTaskStatus
} = require("../services/taskService.js");

const createTask = async (req, res) => {
    const { title, description, status, kanbanId } = req.body;
    const taskData = {
        title,
        description,
        status,
        kanbanId,
    }

    try {
        const savedTask = await create(taskData);
        res.status(200).json({ success: true, message: "Task added successfully", task: savedTask });
    } catch (error) {
        res.status(500).json({ success: true, message: "Server Error." })
    }
}

const getAllTasks = async (req, res) => {
    try {
        const { kanbanId } = req.params;
        
        const tasks = await getTasksByKanbanId(kanbanId);
        res.status(200).json({ success: true, tasks: tasks });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error." });
    }
}

const getTaskById = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Task not found!" });
    }

    try {
        const task = await Task.findById(id);
        res.status(200).json({ success: true, data: task });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error." });
    }
}

const updateTask = async (req, res) => {
    const { id } = req.params;
    const { title, description, status, kanbanId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Task not found!" });
    }

    try {
        const updatedTask = await Task.findByIdAndUpdate(id, { title, description, status, kanbanId }, { new: true });
        res.status(200).json({ success: true, data: updatedTask });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error." });
    }
}

const updateStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Task not found!" });
    }

    try {
        const updatedTask = await updateTaskStatus(id, status);
        res.status(200).json({ success: true, data: updatedTask });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error." });
    }
}

const deleteTask = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Task not found!" });
    }

    try {
        await remove(id);
        res.status(200).json({ success: true, message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error while deleting task." });
    }
}

module.exports = { createTask, getAllTasks, getTaskById, updateTask, deleteTask, updateStatus };