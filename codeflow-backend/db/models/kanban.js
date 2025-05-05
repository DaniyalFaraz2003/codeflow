const mongoose = require('mongoose');

const kanbanSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'project',
        required: true
    }
}, {timestamps: true});

const Kanban = mongoose.model('kanban', kanbanSchema);
module.exports = Kanban;