const Repository = require('../db/models/repository');
const File = require('../db/models/file');

/**
 * Get repository by project ID
 * @param {String} projectId - Project ID
 * @returns {Promise<Object>} - Repository object
 */
const getRepositoryByProjectId = async (projectId) => {
    try {
        const repository = await Repository.findOne({ projectId });

        if (!repository) {
            throw new Error('Repository not found');
        }

        return repository;
    } catch (error) {
        throw new Error(`Error getting repository: ${error.message}`);
    }
};

/**
 * Update repository
 * @param {String} repositoryId - Repository ID
 * @param {Object} repositoryData - Updated repository data
 * @returns {Promise<Object>} - Updated repository
 */
const updateRepository = async (repositoryId, repositoryData) => {
    try {
        const repository = await Repository.findByIdAndUpdate(
            repositoryId,
            repositoryData,
            { new: true, runValidators: true }
        );

        if (!repository) {
            throw new Error('Repository not found');
        }

        return repository;
    } catch (error) {
        throw new Error(`Error updating repository: ${error.message}`);
    }
};

/**
 * Delete repository and all related entities
 * @param {String} repositoryId - Repository ID
 * @returns {Promise<Object>} - Deleted repository
 */
const deleteRepository = async (repositoryId) => {
    try {
        const repository = await Repository.findById(repositoryId);

        if (!repository) {
            throw new Error('Repository not found');
        }

        // Delete all files associated with the repository
        await File.deleteMany({ repositoryId });

        // Delete all commits associated with the repository
        await Commit.deleteMany({ repositoryId });

        // Delete the repository
        await Repository.findByIdAndDelete(repositoryId);

        return repository;
    } catch (error) {
        throw new Error(`Error deleting repository: ${error.message}`);
    }
};

const getFilesByRepositoryId = async (repositoryId) => {
    try {
        const repository = await Repository.findById(repositoryId);

        if (!repository) {
            throw new Error('Repository not found');
        }

        const files = await File.find({ repositoryId: repositoryId }).populate("userId", "username");

        if (!files) {
            throw new Error("No Files Found");
        }

        return files;

    } catch (error) {
        throw new Error(`Error getting files in repository: ${error.message}`);
    }
};


module.exports = {
    getRepositoryByProjectId,
    updateRepository,
    deleteRepository,
    getFilesByRepositoryId
};