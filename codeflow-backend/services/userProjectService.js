const UserProject = require('../models/user-project');

/**
 * Get all collaborations by user ID
 * @param {String} userId - User ID
 * @returns {Promise<Array>} - Array of user-project objects
 */
const getCollaborationsByUserId = async (userId) => {
    try {
        return await UserProject.find({ userId }).populate('projectId');
    } catch (error) {
        throw new Error(`Error getting collaborations: ${error.message}`);
    }
};

/**
 * Get all collaborators for a project
 * @param {String} projectId - Project ID
 * @returns {Promise<Array>} - Array of user-project objects
 */
const getCollaboratorsByProjectId = async (projectId) => {
    try {
        return await UserProject.find({ projectId }).populate('userId');
    } catch (error) {
        throw new Error(`Error getting collaborators: ${error.message}`);
    }
};

/**
 * Check if user is collaborator of project
 * @param {String} userId - User ID
 * @param {String} projectId - Project ID
 * @returns {Promise<Boolean>} - True if user is collaborator
 */
const isCollaborator = async (userId, projectId) => {
    try {
        const collaboration = await UserProject.findOne({ userId, projectId });
        return !!collaboration;
    } catch (error) {
        throw new Error(`Error checking collaboration: ${error.message}`);
    }
};

module.exports = {
    getCollaborationsByUserId,
    getCollaboratorsByProjectId,
    isCollaborator
};