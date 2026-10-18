const mongoose = require('mongoose');


const NoteSchema = mongoose.Schema({
    noteTitle: {
        type: String,
        required: true
    },
    noteDescription: {
        type: String,
        required: true
    },
    priority: {
        type: String,
        enum: ['HIGH', 'LOW', 'MEDIUM'],
        default: 'MEDIUM'
    },
    dateAdded: {
        type: String,
        default: () => new Date().toLocaleDateString('en-GB', { 
            day: '2-digit', month: 'short', year: 'numeric' 
        }).replace(/ /g, '/')
    },
    dateUpdated: {
        type: String,
        default: () => new Date().toLocaleDateString('en-GB', { 
            day: '2-digit', month: 'short', year: 'numeric' 
        }).replace(/ /g, '/')
    }
}, {
    timestamps: false
});

module.exports = mongoose.model('Note', NoteSchema);