const express = require("express");
const { getAllTasks, getTaskById, createTask, updateTask, deleteTask, updateStatus } = require("../controllers/taskController.js");
const { verifyToken } = require("../middleware/auth.js");

const taskRouter = express.Router();

taskRouter.use(verifyToken);

taskRouter.get("/:kanbanId", getAllTasks);
taskRouter.get("/:id", getTaskById);
taskRouter.post("/", createTask);
taskRouter.put("/:id", updateTask);
taskRouter.put("/status/:id", updateStatus)
taskRouter.delete("/:id", deleteTask);

module.exports = taskRouter;