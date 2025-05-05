const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 255
    },
    content: {
        type: String
    },
    hash: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    repositoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'repository',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }
}, {timestamps: true});

const File = mongoose.model("file", fileSchema);
module.exports = File;