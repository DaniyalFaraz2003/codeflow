const projectService = require('./projectService');
const repositoryService = require('./repositoryService');
const fileService = require('./fileService');
const commitService = require('./commitService');
const kanbanService = require('./kanbanService');
const taskService = require('./taskService');
const userProjectService = require('./userProjectService');

module.exports = {
    userService,
    projectService,
    repositoryService,
    fileService,
    commitService,
    kanbanService,
    taskService,
    userProjectService
};