const mongoose = require('mongoose');

const userProject = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'project',
        required: true
    }
}, {timestamps: true});

const UserProject = mongoose.model('userProject', userProject);
module.exports = UserProject;