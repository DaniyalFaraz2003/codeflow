const User = require("../db/models/user.js")
const Project = require("../db/models/project.js")
const UserProject = require("../db/models/user-project.js")
const Kanban = require("../db/models/kanban.js")
const Task = require("../db/models/task.js")
const Repository = require("../db/models/repository.js")
const File = require("../db/models/file.js")

const dummyUsers = [
    {
        name: 'John Doe',
        username: 'johndoe',
        password: 'password123',
        image: 'https://example.com/images/johndoe.jpg'
    },
    {
        name: 'Jane Smith',
        username: 'janesmith',
        password: 'securepass456',
        image: 'https://example.com/images/janesmith.jpg'
    },
    {
        name: 'Alex Johnson',
        username: 'alexj',
        password: 'alexpass789',
        image: 'https://example.com/images/alexj.jpg'
    },
    {
        name: 'Sarah Williams',
        username: 'sarahw',
        password: 'sarahpass321',
        image: 'https://example.com/images/sarahw.jpg'
    },
    {
        name: 'Mike Brown',
        username: 'mikeb',
        password: 'mikepass654',
        image: 'https://example.com/images/mikeb.jpg'
    }
]

const dummyProjects = [
    {
        name: 'E-commerce Website',
        description: 'Online store for selling products'
    },
    {
        name: 'Task Management App',
        description: 'Application for organizing team tasks'
    },
    {
        name: 'Portfolio Site',
        description: 'Personal portfolio website'
    },
    {
        name: 'Weather Dashboard',
        description: 'Real-time weather information system'
    },
    {
        name: 'Social Media Platform',
        description: 'Community networking application'
    }
]

const userProjectAssignment = [
    // User 0 (John Doe) owns Project 0 and collaborates on Project 3
    { userId: 0, projectId: 0 },
    { userId: 0, projectId: 3 },

    // User 1 (Jane Smith) owns Project 1 and collaborates on Project 4
    { userId: 1, projectId: 1 },
    { userId: 1, projectId: 4 },

    // User 2 (Alex Johnson) owns Project 2 and collaborates on Project 0
    { userId: 2, projectId: 2 },
    { userId: 2, projectId: 0 },

    // User 3 (Sarah Williams) owns Project 3 and collaborates on Project 1
    { userId: 3, projectId: 3 },
    { userId: 3, projectId: 1 },

    // User 4 (Mike Brown) owns Project 4 and collaborates on Project 2
    { userId: 4, projectId: 4 },
    { userId: 4, projectId: 2 }
];

const dummyTasks = [
    {
        title: 'Design homepage layout',
        description: 'Create wireframes for the main landing page',
        status: 'Doing'
    },
    {
        title: 'Implement user authentication',
        description: 'Set up login and registration system',
        status: 'To Do'
    },
    {
        title: 'Create database schema',
        description: 'Design the MongoDB collections and relationships',
        status: 'Done'
    },
    {
        title: 'Write API documentation',
        description: 'Document all endpoints for developer reference',
        status: 'To Do'
    },
    {
        title: 'Optimize performance',
        description: 'Improve loading times and reduce API response sizes',
        status: 'Doing'
    }
]

const dummyFiles = [
    {
        name: 'index.html',
        content: '<!DOCTYPE html>\n<html>\n<head>\n<title>Project</title>\n</head>\n<body>\n</body>\n</html>',
        hash: "a1b2c3d4e5",
        message: "Initial project setup"
    },
    {
        name: 'styles.css',
        content: 'body {\n  font-family: Arial, sans-serif;\n  margin: 0;\n  padding: 0;\n}',
        hash: "f6g7h8i9j0",
        message: "Added authentication middleware"
    },
    {
        name: 'app.js',
        content: 'console.log("Hello World");\n\nfunction init() {\n  // Application initialization\n}',
        hash: "k1l2m3n4o5",
        message: "Fixed database connection issue"
    },
    {
        name: 'README.md',
        content: '# Project Documentation\n\n## Getting Started\n\n1. Install dependencies\n2. Run the server',
        hash: "p6q7r8s9t0",
        message: "Implemented file upload functionality"
    },
    {
        name: 'config.json',
        content: '{\n  "apiUrl": "https://api.example.com",\n  "debugMode": false\n}',
        hash: "u1v2w3x4y5",
        message: "Updated README with installation instructions"
    }
];

async function initDB() {
    try {
        // clear existing data first 
        await User.deleteMany({});
        await Project.deleteMany({});
        await UserProject.deleteMany({});
        await Kanban.deleteMany({});
        await Task.deleteMany({});
        await Repository.deleteMany({});
        await File.deleteMany({});
    
        // Create users sequentially
        const users = await User.insertMany(dummyUsers);
        // console.log('Users created successfully:', users);

        // Assign projects to users
        const assignUsersToProjects = dummyProjects.map((project, index) => ({
            ...project,
            userId: users[index % users.length]._id
        }));

        // Create projects sequentially
        const projects = await Project.insertMany(assignUsersToProjects);
        // console.log('Projects created successfully:', projects);

        // Create user-project relationships sequentially
        const userProjects = [];
        for (const relation of userProjectAssignment) {
            const up = await UserProject.create({
                userId: users[relation.userId]._id,
                projectId: projects[relation.projectId]._id
            });
            userProjects.push(up);
        }
        // console.log('User-Project relationships created successfully:', userProjects);

        // Create kanban boards sequentially
        const kanbanBoards = [];
        for (const project of projects) {
            const kanban = await Kanban.create({
                projectId: project._id
            });
            kanbanBoards.push(kanban);
        }
        // console.log('Kanban boards created successfully:', kanbanBoards);

        // Create tasks sequentially
        const tasks = [];
        for (let i = 0; i < kanbanBoards.length; i++) {
            const task = await Task.create({
                ...dummyTasks[i],
                kanbanId: kanbanBoards[i]._id
            });
            tasks.push(task);
        }
        // console.log('Tasks created successfully:', tasks);

        // Create repositories sequentially
        const repositories = [];
        for (const project of projects) {
            const repo = await Repository.create({
                projectId: project._id
            });
            repositories.push(repo);
        }
        // console.log('Repositories created successfully:', repositories);

        // Create files sequentially
        const files = [];
        for (let i = 0; i < repositories.length; i++) {
            const file = await File.create({
                name: dummyFiles[i].name,
                content: dummyFiles[i].content,
                hash: dummyFiles[i].hash,
                message: dummyFiles[i].message,
                repositoryId: repositories[i]._id,
                userId: users[i]._id
            });
            files.push(file);
        }
        // console.log('Files created successfully:', files);


    } catch (error) {
        console.error('Error during database initialization:', error);
        throw error;
    }
}

module.exports = { initDB };