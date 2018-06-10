const mongoose = require("mongoose");

// Create a reference to the Mongoose Schema constructor
const Schema = mongoose.Schema;

// Create the Note Schema Object
const NoteSchema = new Schema({
    title: String,
    body: String
});

// Create our Note model using the Mongoose Schema above
const Note = mongoose.model("Note", NoteSchema);

module.exports = Note;