const express = require("express");
const { verifyToken } = require("../middleware/auth");
const {
    createProject,
    getAllProjects,
    updateProject,
    deleteProject,
    getProjectById,
    getTotalCommits,
    getTotalFiles,
    getTotalCollaborators,
    getTotalTasks,
    getTotalDoneTasks,
    getTotalToDoTasks,
    getTotalDoingTasks,
    addCollaboratorToProject
} = require("../controllers/projectController");
const router = express.Router();

router.use(verifyToken);


router.post("/", createProject); 
router.get("/", getAllProjects); 
router.get("/:id", getProjectById); 
router.put("/:id", updateProject); 
router.delete("/:id", deleteProject); 
router.get("/stats/commits/:id", getTotalCommits);
router.get("/stats/files/:id", getTotalFiles);
router.get("/stats/collaborators/:id", getTotalCollaborators);
router.get("/stats/tasks/:id", getTotalTasks);
router.get("/stats/done/:id", getTotalDoneTasks);
router.get("/stats/todo/:id", getTotalToDoTasks);
router.get("/stats/doing/:id", getTotalDoingTasks);
router.post("/collaborator/:id", addCollaboratorToProject)

module.exports = router;
