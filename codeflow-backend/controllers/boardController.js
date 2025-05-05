const Kanban = require('../db/models/kanban'); // Assuming you have a Kanban model defined in models/Kanban.js

// Create a new Kanban board for a project
const createKanban = async (req, res) => {
    const { projectId } = req.body;

    if (!projectId) {
        return res.status(400).json({ message: 'projectId is required' });
    }

    try {
        // Check if Kanban already exists for the project
        const existingBoard = await Kanban.findOne({ projectId });
        if (existingBoard) {
            return res.status(400).json({ message: 'Kanban board already exists for this project' });
        }

        const newKanban = new Kanban({ projectId });
        const savedKanban = await newKanban.save();

        res.status(201).json(savedKanban);
    } catch (error) {
        console.error('Error creating Kanban board:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get Kanban board by projectId
const getKanbanByProjectId = async (req, res) => {
    const { projectId } = req.params;

    try {
        const kanban = await Kanban.findOne({ projectId });

        if (!kanban) {
            return res.status(404).json({ message: 'Kanban board not found for this project' });
        }
        
        
        res.status(200).json({
            success: true,
            kanban
        });
    } catch (error) {
        console.error('Error fetching Kanban board:', error);
        res.status(500).json({ message: 'Server error while fetching kanban board' });
    }
};

module.exports = {
    createKanban,
    getKanbanByProjectId,
};
