const mongoose = require("mongoose")

const {
    getRepositoryByProjectId,
    getFilesByRepositoryId
} = require("../services/repositoryService");


const getRepositoryFromProjectId = async (req, res) => {
    const { projectId } = req.params;
    try {
        const repository = await getRepositoryByProjectId(projectId);
        if (!repository) {
            return res.status(404).json({ message: "Repository not found" });
        }

        return res.status(200).json({
            success: true,
            repository
        });
    } catch (error) {
        console.error("Error fetching repository:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const getAllFiles = async (req, res) => {
    try {
        const { repositoryId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(repositoryId)) {
            return res.status(404).json({ success: false, message: "Repository not found!" });
        }

        const files = await getFilesByRepositoryId(repositoryId);

        res.status(200).json({ success: true, files });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


module.exports = {
    getRepositoryFromProjectId,
    getAllFiles
}