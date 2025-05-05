const crypto = require("crypto");
const {
    createFile
} = require("../services/fileService")
const {
    getFilesByRepositoryId
} = require("../services/repositoryService")

const uploadFile = async (req, res) => {
    try {
        const { message } = req.body;
        const { repositoryId } = req.params;
        const userId = req.session.userId; // Assuming you have user ID from the request

        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const { originalname: name, buffer } = req.file;
        const content = buffer.toString('utf8'); // Convert buffer to string

        const hash = crypto.createHash('sha256').update(content).digest('hex'); // Generate hash of the file content
        const fileData = {
            name,
            content,
            hash,
            message,
            repositoryId,
            userId
        };

        const file = await createFile(fileData);
        const files = await getFilesByRepositoryId(repositoryId);

        res.status(201).json({
            success: true,
            files
        });
    } catch (error) {
        console.error("Error uploading file:", error);
        res.status(500).json({ success: false, message: "Internal server error while uploading file" });
    }
}

module.exports = {
    uploadFile
}