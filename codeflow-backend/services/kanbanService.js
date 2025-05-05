const Kanban = require('../models/kanban');
const Task = require('../models/task');

/**
 * Get kanban by project ID
 * @param {String} projectId - Project ID
 * @returns {Promise<Object>} - Kanban object
 */
const getKanbanByProjectId = async (projectId) => {
    try {
        const kanban = await Kanban.findOne({ projectId });

        if (!kanban) {
            throw new Error('Kanban not found');
        }

        return kanban;
    } catch (error) {
        throw new Error(`Error getting kanban: ${error.message}`);
    }
};

/**
 * Update kanban
 * @param {String} kanbanId - Kanban ID
 * @param {Object} kanbanData - Updated kanban data
 * @returns {Promise<Object>} - Updated kanban
 */
const updateKanban = async (kanbanId, kanbanData) => {
    try {
        const kanban = await Kanban.findByIdAndUpdate(
            kanbanId,
            kanbanData,
            { new: true, runValidators: true }
        );

        if (!kanban) {
            throw new Error('Kanban not found');
        }

        return kanban;
    } catch (error) {
        throw new Error(`Error updating kanban: ${error.message}`);
    }
};

/**
 * Delete kanban and all tasks
 * @param {String} kanbanId - Kanban ID
 * @returns {Promise<Object>} - Deleted kanban
 */
const deleteKanban = async (kanbanId) => {
    try {
        const kanban = await Kanban.findById(kanbanId);

        if (!kanban) {
            throw new Error('Kanban not found');
        }

        // Delete all tasks associated with the kanban
        await Task.deleteMany({ kanbanId });

        // Delete the kanban
        await Kanban.findByIdAndDelete(kanbanId);

        return kanban;
    } catch (error) {
        throw new Error(`Error deleting kanban: ${error.message}`);
    }
};

module.exports = {
    getKanbanByProjectId,
    updateKanban,
    deleteKanban
};