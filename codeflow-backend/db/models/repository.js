const mongoose = require('mongoose');

const repositorySchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'project',
        required: true
    }
}, {timestamps: true});

const Repository = mongoose.model('repository', repositorySchema);
module.exports = Repository;