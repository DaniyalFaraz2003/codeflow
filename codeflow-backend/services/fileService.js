const File = require('../db/models/file');

/**
 * Create a new file
 * @param {Object} fileData - File data
 * @returns {Promise<Object>} - Created file
 */
const createFile = async (fileData) => {
    try {
        const file = new File(fileData);
        return await file.save();
    } catch (error) {
        throw new Error(`Error creating file: ${error.message}`);
    }
};

/**
 * Get files by repository ID
 * @param {String} repositoryId - Repository ID
 * @returns {Promise<Array>} - Array of files
 */
const getFilesByRepositoryId = async (repositoryId) => {
    try {
        return await File.find({ repositoryId });
    } catch (error) {
        throw new Error(`Error getting files: ${error.message}`);
    }
};

/**
 * Get file by ID
 * @param {String} fileId - File ID
 * @returns {Promise<Object>} - File object
 */
const getFileById = async (fileId) => {
    try {
        const file = await File.findById(fileId);

        if (!file) {
            throw new Error('File not found');
        }

        return file;
    } catch (error) {
        throw new Error(`Error getting file: ${error.message}`);
    }
};

/**
 * Update file
 * @param {String} fileId - File ID
 * @param {Object} fileData - Updated file data
 * @returns {Promise<Object>} - Updated file
 */
const updateFile = async (fileId, fileData) => {
    try {
        const file = await File.findByIdAndUpdate(
            fileId,
            fileData,
            { new: true, runValidators: true }
        );

        if (!file) {
            throw new Error('File not found');
        }

        return file;
    } catch (error) {
        throw new Error(`Error updating file: ${error.message}`);
    }
};

/**
 * Delete file
 * @param {String} fileId - File ID
 * @returns {Promise<Object>} - Deleted file
 */
const deleteFile = async (fileId) => {
    try {
        const file = await File.findByIdAndDelete(fileId);

        if (!file) {
            throw new Error('File not found');
        }

        return file;
    } catch (error) {
        throw new Error(`Error deleting file: ${error.message}`);
    }
};

module.exports = {
    createFile,
    getFilesByRepositoryId,
    getFileById,
    updateFile,
    deleteFile
};