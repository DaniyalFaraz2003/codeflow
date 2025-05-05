const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    description: {
        type: String,
        trim: true,
        maxlength: 1700
    },
    status: {
        type: String,
        default: 'To Do'
    },
    kanbanId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'kanban',
        required: true
    }
}, {timestamps: true});

const Task = mongoose.model("task", taskSchema);
module.exports = Task;