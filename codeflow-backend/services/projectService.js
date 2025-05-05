const Project = require('../db/models/project');
const UserProject = require('../db/models/user-project');
const Repository = require('../db/models/repository');
const Kanban = require('../db/models/kanban');
const Task = require('../db/models/task');
const File = require('../db/models/file');
const mongoose = require("mongoose")

/**
 * Create a new project
 * @param {Object} projectData - Project data
 * @returns {Promise<Object>} - Created project
 */
const create = async (projectData) => {
    try {
        const project = new Project(projectData);
        const savedProject = await project.save();

        // Create repository for the project
        const repository = new Repository({
            projectId: savedProject._id
        });
        await repository.save();

        // Create kanban board for the project
        const kanban = new Kanban({
            projectId: savedProject._id
        });
        await kanban.save();

        // Create user-project association if not the owner
        if (projectData.collaboratorId && projectData.collaboratorId !== projectData.userId) {
            const userProject = new UserProject({
                userId: projectData.collaboratorId,
                projectId: savedProject._id
            });
            await userProject.save();
        }

        return savedProject;
    } catch (error) {
        throw new Error(`Error creating project: ${error.message}`);
    }
};

/**
 * Get all projects
 * @returns {Promise<Array>} - Array of projects
 */
const getAllProjects = async () => {
    try {
        return await Project.find({});
    } catch (error) {
        throw new Error(`Error getting projects: ${error.message}`);
    }
};

/**
 * Get projects by user ID
 * @param {String} userId - User ID
 * @returns {Promise<Array>} - Array of projects
 */
const getProjectsByUserId = async (userId) => {
    try {
        // Find projects where the user is the owner
        const ownedProjects = await Project.find({ userId });

        // Find collaborations
        const collaborations = await UserProject.find({ userId }).populate('projectId');
        const collaboratedProjects = collaborations.map(collab => collab.projectId);

        // Combine and return unique projects
        return [...ownedProjects, ...collaboratedProjects];
    } catch (error) {
        throw new Error(`Error getting user projects: ${error.message}`);
    }
};

/**
 * Get project by ID
 * @param {String} projectId - Project ID
 * @returns {Promise<Object>} - Project object
 */
const getProjectById = async (projectId) => {
    try {
        const project = await Project.findById(projectId);

        if (!project) {
            throw new Error('Project not found');
        }

        return project;
    } catch (error) {
        throw new Error(`Error getting project: ${error.message}`);
    }
};

/**
 * Update project
 * @param {String} projectId - Project ID
 * @param {Object} projectData - Updated project data
 * @returns {Promise<Object>} - Updated project
 */
const updateProject = async (projectId, projectData) => {
    try {
        const project = await Project.findByIdAndUpdate(
            projectId,
            projectData,
            { new: true, runValidators: true }
        );

        if (!project) {
            throw new Error('Project not found');
        }

        return project;
    } catch (error) {
        throw new Error(`Error updating project: ${error.message}`);
    }
};

/**
 * Delete project and all related entities
 * @param {String} projectId - Project ID
 * @returns {Promise<Object>} - Deleted project
 */
const remove = async (projectId) => {
    try {
        // Find and delete the project
        const project = await Project.findById(projectId);

        if (!project) {
            throw new Error('Project not found or you do not have permission');
        }

        // Find repository associated with the project
        const repository = await Repository.findOne({ projectId });

        if (repository) {
            // Delete all files associated with the repository
            await File.deleteMany({ repositoryId: repository._id });


            // Delete the repository
            await Repository.findByIdAndDelete(repository._id);
        }

        // Find kanban associated with the project
        const kanban = await Kanban.findOne({ projectId });

        if (kanban) {
            // Delete all tasks associated with the kanban
            await Task.deleteMany({ kanbanId: kanban._id });

            // Delete the kanban
            await Kanban.findByIdAndDelete(kanban._id);
        }

        // Delete all user-project associations
        await UserProject.deleteMany({ projectId });

        // Delete the project
        await Project.findByIdAndDelete(projectId);

        return project;
    } catch (error) {
        throw new Error(`Error deleting project: ${error.message}`);
    }
};

/**
 * Add collaborator to project
 * @param {String} projectId - Project ID
 * @param {String} userId - User ID to add as collaborator
 * @returns {Promise<Object>} - User-project association
 */
const addCollaborator = async (projectId, userId) => {
    try {
        const project = await Project.findById(projectId);

        if (!project) {
            throw new Error('Project not found');
        }

        // Check if user is already a collaborator
        const existingCollaboration = await UserProject.findOne({
            projectId,
            userId
        });

        if (existingCollaboration) {
            throw new Error('User is already a collaborator');
        }

        // Create new collaboration
        const userProject = new UserProject({
            userId,
            projectId
        });

        return await userProject.save();
    } catch (error) {
        throw new Error(`Error adding collaborator: ${error.message}`);
    }
};

/**
 * Remove collaborator from project
 * @param {String} projectId - Project ID
 * @param {String} userId - User ID to remove
 * @returns {Promise<Object>} - Result of operation
 */
const removeCollaborator = async (projectId, userId) => {
    try {
        const project = await Project.findById(projectId);

        if (!project) {
            throw new Error('Project not found');
        }

        const result = await UserProject.findOneAndDelete({
            projectId,
            userId
        });

        if (!result) {
            throw new Error('Collaboration not found');
        }

        return result;
    } catch (error) {
        throw new Error(`Error removing collaborator: ${error.message}`);
    }
};

/**
 * Get project statistics (commits count)
 * @param {String} projectId - Project ID
 * @returns {Promise<Object>} - Object with files and commits count
 */
const getTotalCommitsByProjectId = async (projectId) => {
    try {
        const repository = await Repository.findOne({projectId: projectId});
        if(!repository) {
            return 0; // no repository, so no commits
        }

        const totalCommits = await File.countDocuments({repositoryId: repository._id});
        
        return totalCommits;
    } catch (error) {
        throw new Error(`Error getting commit count: ${error.message}`);
    }
};

/**
 * Get total files count for a project
 * @param {String} projectId - Project ID
 * @returns {Promise<Number>} - Total number of files
 */
const getTotalFilesByProjectId = async (projectId) => {
    try {
        const repository = await Repository.findOne({projectId: projectId});

        if(!repository) {
            return 0; // no repository, so no files
        }

        const totalFiles = await File.countDocuments({repositoryId: repository._id});

        return totalFiles;
    } catch (error) {
        throw new Error(`Error getting file count: ${error.message}`);
    }
};

/**
 * Get collaborators for a project
 * @param {String} projectId - Project ID 
 * @returns {Promise<Number>} 
 */
const getTotalCollaboratorsByProjectId = async (projectId) => {
    try {
        const totalCollaborators = await UserProject.countDocuments({projectId: projectId});

        return totalCollaborators;
    } catch (error) {
        throw new Error(`Error getting collaborator count: ${error.message}`);
    }
};

/**
 * Get total tasks count for a project
 * @param {String} projectId - Project ID
 * @returns {Promise<Number>} - Total number of tasks
 */
const getTotalTasksByProjectId = async (projectId) => {
    try {
        const kanban = await Kanban.findOne({projectId: projectId});

        if(!kanban) {
            return 0; // no kanban, no tasks
        }

        const totalTasks = await Task.countDocuments({kanbanId: kanban._id});

        return totalTasks;
    } catch (error) {
        throw new Error(`Error getting task count: ${error.message}`);
    }
};

/**
 * Get count of "done" tasks for a project
 * @param {String} projectId - Project ID
 * @returns {Promise<Number>} - Number of "Done" tasks
 */
const getDoneTasksByProjectId = async (projectId) => {
    try {
        const kanban = await Kanban.findOne({projectId: projectId});

        if(!kanban) {
            return 0; // no kanban, no tasks
        }

        const totalTasksDone = await Task.countDocuments({kanbanId: kanban._id, status: "Done"});
        return totalTasksDone;
    } catch (error) {
        throw new Error(`Error getting "Done" task count: ${error.message}`);
    }
};

/**
 * Get count of "To Do" tasks for a project
 * @param {String} projectId - Project ID
 * @returns {Promise<Number>} - Number of "To Do" tasks
 */
const getToDoTasksByProjectId = async (projectId) => {
    try {
        const kanban = await Kanban.findOne({projectId: projectId});

        if(!kanban) {
            return 0; // no kanban, no tasks
        }

        const totalToDoTasks = await Task.countDocuments({kanbanId: kanban._id, status: "To Do"});
        return totalToDoTasks;
    } catch (error) {
        throw new Error(`Error getting "To Do" task count: ${error.message}`);
    }
};

/**
 * Get count of "Doing" tasks for a project
 * @param {String} projectId - Project ID
 * @returns {Promise<Number>} - Number of "Doing" tasks
 */
const getDoingTasksByProjectId = async (projectId) => {
    try {
        const kanban = await Kanban.findOne({projectId: projectId});

        if(!kanban) {
            return 0; // no kanban, no tasks
        }

        const totalDoingTasks = await Task.countDocuments({kanbanId: kanban._id, status: "Doing"});
        return totalDoingTasks;
    } catch (error) {
        throw new Error(`Error getting "Doing" task count: ${error.message}`);
    }
};

module.exports = {
    create,
    getAllProjects,
    getProjectsByUserId,
    getProjectById,
    updateProject,
    remove,
    addCollaborator,
    removeCollaborator,
    getTotalCommitsByProjectId,
    getTotalFilesByProjectId,
    getTotalCollaboratorsByProjectId,
    getTotalTasksByProjectId,
    getDoneTasksByProjectId,
    getToDoTasksByProjectId,
    getDoingTasksByProjectId
};