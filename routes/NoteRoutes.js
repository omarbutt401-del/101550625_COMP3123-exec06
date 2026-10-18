const noteModel = require('../models/NotesModel.js');
const express = require('express');
const noteRoutes = express.Router();

// CREATE - Create a new Note
noteRoutes.post('/notes', async (req, res) => {
    if (!req.body.content) {
        return res.status(400).send({ message: "Note content can not be empty" });
    }

    const { noteTitle, noteDescription, priority, dateAdded, dateUpdated } = req.body.content;

    if (!noteTitle || !noteDescription) {
        return res.status(400).send({ message: "noteTitle and noteDescription are required" });
    }

    try {
        const note = new noteModel({
            noteTitle,
            noteDescription,
            priority,
            dateAdded,
            dateUpdated
        });
        const savedNote = await note.save();
        res.status(201).send(savedNote);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Note."
        });
    }
});

// READ ALL - Retrieve all Notes
noteRoutes.get('/notes', async (req, res) => {
    try {
        const notes = await noteModel.find();
        res.status(200).send(notes);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving notes."
        });
    }
});

// READ ONE - Retrieve a single Note by noteId
noteRoutes.get('/notes/:noteId', async (req, res) => {
    try {
        const note = await noteModel.findById(req.params.noteId);
        if (!note) {
            return res.status(404).send({ message: "Note not found with id " + req.params.noteId });
        }
        res.status(200).send(note);
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(404).send({ message: "Note not found with id " + req.params.noteId });
        }
        res.status(500).send({ message: "Error retrieving note with id " + req.params.noteId });
    }
});

// UPDATE - Update a Note by noteId
noteRoutes.put('/notes/:noteId', async (req, res) => {
    if (!req.body.content) {
        return res.status(400).send({ message: "Note content can not be empty" });
    }

    const { noteTitle, noteDescription, priority, dateAdded, dateUpdated } = req.body.content;

    try {
        const note = await noteModel.findByIdAndUpdate(
            req.params.noteId,
            {
                noteTitle,
                noteDescription,
                priority,
                dateAdded,
                dateUpdated: dateUpdated || new Date().toLocaleDateString('en-GB', {
                    day: '2-digit', month: 'short', year: 'numeric'
                }).replace(/ /g, '/')
            },
            { new: true, runValidators: true }
        );

        if (!note) {
            return res.status(404).send({ message: "Note not found with id " + req.params.noteId });
        }
        res.status(200).send(note);
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(404).send({ message: "Note not found with id " + req.params.noteId });
        }
        res.status(500).send({ message: "Error updating note with id " + req.params.noteId });
    }
});

// DELETE - Delete a Note by noteId
noteRoutes.delete('/notes/:noteId', async (req, res) => {
    try {
        const note = await noteModel.findByIdAndDelete(req.params.noteId);
        if (!note) {
            return res.status(404).send({ message: "Note not found with id " + req.params.noteId });
        }
        res.status(200).send({ message: "Note deleted successfully!" });
    } catch (err) {
        if (err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({ message: "Note not found with id " + req.params.noteId });
        }
        res.status(500).send({ message: "Could not delete note with id " + req.params.noteId });
    }
});

module.exports = noteRoutes;