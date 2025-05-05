const express = require("express");
const multer = require("multer")

const {
    getRepositoryFromProjectId,
    getAllFiles
} = require("../controllers/repositoryController");
const {
    uploadFile
} = require("../controllers/fileController");

const { verifyToken } = require("../middleware/auth");

const router = express.Router();

router.use(verifyToken);

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

router.get("/:projectId", getRepositoryFromProjectId); // Get repository by projectId
router.get("/files/:repositoryId", getAllFiles);
router.post("/files/:repositoryId", upload.single("file"), uploadFile); // Upload file to repository

module.exports = router;