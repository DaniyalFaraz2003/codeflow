const Task = require('../db/models/task');

/**
 * Create a new task
 * @param {Object} taskData - Task data
 * @returns {Promise<Object>} - Created task
 */
const create = async (taskData) => {
    try {
        const task = new Task(taskData);
        return await task.save();
    } catch (error) {
        throw new Error(`Error creating task: ${error.message}`);
    }
};

/**
 * Get tasks by kanban ID
 * @param {String} kanbanId - Kanban ID
 * @returns {Promise<Array>} - Array of tasks
 */
const getTasksByKanbanId = async (kanbanId) => {
    try {
        return await Task.find({ kanbanId });
    } catch (error) {
        throw new Error(`Error getting tasks: ${error.message}`);
    }
};

/**
 * Get task by ID
 * @param {String} taskId - Task ID
 * @returns {Promise<Object>} - Task object
 */
const getTaskById = async (taskId) => {
    try {
        const task = await Task.findById(taskId);

        if (!task) {
            throw new Error('Task not found');
        }

        return task;
    } catch (error) {
        throw new Error(`Error getting task: ${error.message}`);
    }
};

/**
 * Update task
 * @param {String} taskId - Task ID
 * @param {Object} taskData - Updated task data
 * @returns {Promise<Object>} - Updated task
 */
const updateTask = async (taskId, taskData) => {
    try {
        const task = await Task.findByIdAndUpdate(
            taskId,
            taskData,
            { new: true, runValidators: true }
        );

        if (!task) {
            throw new Error('Task not found');
        }

        return task;
    } catch (error) {
        throw new Error(`Error updating task: ${error.message}`);
    }
};

/**
 * Delete task
 * @param {String} taskId - Task ID
 * @returns {Promise<Object>} - Deleted task
 */
const remove = async (taskId) => {
    try {
        const task = await Task.findByIdAndDelete(taskId);

        if (!task) {
            throw new Error('Task not found');
        }

        return task;
    } catch (error) {
        throw new Error(`Error deleting task: ${error.message}`);
    }
};

/**
 * Update task status
 * @param {String} taskId - Task ID
 * @param {String} status - New status
 * @returns {Promise<Object>} - Updated task
 */
const updateTaskStatus = async (taskId, status) => {
    try {
        const task = await Task.findByIdAndUpdate(
            taskId,
            { status },
            { new: true, runValidators: true }
        );

        if (!task) {
            throw new Error('Task not found');
        }

        return task;
    } catch (error) {
        throw new Error(`Error updating task status: ${error.message}`);
    }
};

module.exports = {
    create,
    getTasksByKanbanId,
    getTaskById,
    updateTask,
    remove,
    updateTaskStatus
};
