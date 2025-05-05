const express = require("express");

const {
    createKanban,
    getKanbanByProjectId
} = require("../controllers/boardController");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

router.use(verifyToken);

router.post("/", createKanban); // Create a new Kanban board for a project
router.get("/:projectId", getKanbanByProjectId); // Get Kanban board by projectId

module.exports = router;