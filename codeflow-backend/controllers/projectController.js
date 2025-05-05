const Project = require("../db/models/project");
const User = require("../db/models/user");
const UserProject = require("../db/models/user-project")
const {
    create,
    remove,
    getTotalCommitsByProjectId,
    getTotalFilesByProjectId,
    getTotalCollaboratorsByProjectId,
    getTotalTasksByProjectId,
    getDoneTasksByProjectId,
    getToDoTasksByProjectId,
    getDoingTasksByProjectId,
    addCollaborator
} = require("../services/projectService");
const mongoose = require("mongoose")

const createProject = async (req, res) => {
    try {
        const { name, description } = req.body;
        const userId = req.session.userId; // Assuming you have user ID from the request

        const projectData = {
            name,
            description,
            userId
        };

        const newProject = await create(projectData);

        res.status(201).json({
            success: true,
            project: newProject
        });
    } catch (error) {
        console.error("Error creating project:", error);
        res.status(500).json({ success: false, message: "Internal server error while creating project" });
    }
}

const getAllProjects = async (req, res) => {
    try {
        const userId = req.session.userId;

        // Get projects where user is the owner
        const ownedProjects = await Project.find({ userId })
            .populate('userId', 'name username image'); // Optional: populate user details

        // Get projects where user is a collaborator
        const collaborationProjects = await UserProject.find({ userId })
            .populate({
                path: 'projectId',
                populate: {
                    path: 'userId',
                    select: 'name username image' // Optional: populate project owner details
                }
            });

        // Combine and format the results
        const projects = [
            ...ownedProjects.map(p => ({ ...p.toObject(), role: 'owner' })),
            ...collaborationProjects.map(cp => ({ 
                ...cp.projectId.toObject(), 
                role: 'collaborator' 
            }))
        ];

        const uniqueProjects = projects.reduce((acc, project) => {
            const existingProject = acc.find(p => p._id.toString() === project._id.toString());
            
            if (!existingProject) {
                acc.push(project);
            } else if (existingProject.role === 'collaborator' && project.role === 'owner') {
                // Replace collaborator with owner if we find an owner version
                acc = acc.filter(p => p._id.toString() !== project._id.toString());
                acc.push(project);
            }
            
            return acc;
        }, []);

        res.status(200).json({
            success: true,
            count: uniqueProjects.length,
            projects: uniqueProjects
        });
    } catch (error) {
        console.error("Error fetching projects:", error);
        res.status(500).json({ 
            success: false, 
            message: "Internal server error while fetching projects" 
        });
    }
}

const updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        // Assuming user ID is available from authentication middleware
        const userId = req.session.userId;

        // Check if project exists and belongs to user
        const project = await Project.findOne({ _id: id, userId });

        if (!project) {
            return res.status(404).json({
                success: false,
                error: 'Project not found or you do not have permission'
            });
        }

        // Update project
        const updatedProject = await Project.findByIdAndUpdate(
            id,
            { name, description },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            data: updatedProject
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;

        await remove(id); // Assuming remove is a function that deletes the project

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

const getProjectById = async (req, res) => {
    try {
        const { id } = req.params;

        // Assuming user ID is available from authentication middleware
        const userId = req.session.userId;

        // Check if project exists and belongs to user
        const project = await Project.findOne({ _id: id });

        if (!project) {
            return res.status(404).json({
                success: false,
                error: 'Project not found or you do not have permission'
            });
        }

        res.status(200).json({
            success: true,
            project
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

const addCollaboratorToProject = async (req, res) => {
    try {
        const { id } = req.params;
        const { username } = req.body; // Assuming you send the collaborator ID in the request body

        const user = await User.findOne({ username: username });
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        const userId = user._id; // Assuming you have the user ID from the request
        await addCollaborator(id, userId); // Assuming addCollaborator is a function that adds the collaborator
        return res.status(200).json({
            success: true,
            message: 'Collaborator added successfully'
        });
    } catch (error) {
        console.error("Error adding collaborator:", error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};


const getTotalCommits = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ success: false, message: "Project not found!" });
        }

        const total = await getTotalCommitsByProjectId(id);
        res.status(200).json({success: true, total: total});
    } catch (error) {
        res.status(500).json({success: false, error: error.message});
    }
};

const getTotalFiles = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ success: false, message: "Project not found!" });
        }

        const total = await getTotalFilesByProjectId(id);
        res.status(200).json({success: true, total: total});
    } catch (error) {
        res.status(500).json({success: false, error: error.message});
    }
};

const getTotalCollaborators = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ success: false, message: "Project not found!" });
        }

        const total = await getTotalCollaboratorsByProjectId(id);
        res.status(200).json({success: true, total: total});
    } catch (error) {
        res.status(500).json({success: false, error: error.message});
    }
};

const getTotalTasks = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ success: false, message: "Project not found!" });
        }

        const total = await getTotalTasksByProjectId(id);
        res.status(200).json({success: true, total: total});
    } catch (error) {
        res.status(500).json({success: false, error: error.message});
    }
};

const getTotalDoneTasks = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ success: false, message: "Project not found!" });
        }

        const total = await getDoneTasksByProjectId(id);
        res.status(200).json({success: true, total: total});
    } catch (error) {
        res.status(500).json({success: false, error: error.message});
    }
};

const getTotalToDoTasks = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ success: false, message: "Project not found!" });
        }

        const total = await getToDoTasksByProjectId(id);
        res.status(200).json({success: true, total: total});
    } catch (error) {
        res.status(500).json({success: false, error: error.message});
    }
};

const getTotalDoingTasks = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ success: false, message: "Project not found!" });
        }

        const total = await getDoingTasksByProjectId(id);
        res.status(200).json({success: true, total: total});
    } catch (error) {
        res.status(500).json({success: false, error: error.message});
    }
};

module.exports = {
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
};