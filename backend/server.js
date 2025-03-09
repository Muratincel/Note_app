const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const NOTES_FILE = "./notes.json";

// Helper function to read notes
const getNotes = () => {
    try {
        return JSON.parse(fs.readFileSync(NOTES_FILE));
    } catch (err) {
        return [];
    }
};

// GET all notes
app.get("/notes", (req, res) => {
    res.json(getNotes());
});

// POST a new note
app.post("/notes", (req,res) => {
    const notes = getNotes();
    const newNote = {id: Date.now(), title: req.body.title, content: req.body.content};
    notes.push(newNote);

    fs.writeFileSync(NOTES_FILE, JSON.stringify(notes, null, 2));
    res.json(newNote);
})

// DELETE a note by id
app.delete("/notes/:id", (req, res) => {
    const noteId = parseInt(req.params.id);
    const notes = getNotes();
    const filteredNotes = notes.filter(note => note.id !== noteId);
    
    fs.writeFileSync(NOTES_FILE, JSON.stringify(filteredNotes, null, 2));
    res.json({ success: true });
  });

  // PUT: Update a note by id
app.put("/notes/:id", (req, res) => {
    const noteId = parseInt(req.params.id);
    const { title, content } = req.body;
    let notes = getNotes();
    const noteIndex = notes.findIndex(note => note.id === noteId);
  
    if (noteIndex === -1) {
      return res.status(404).json({ error: "Note not found" });
    }
  
    // Update the note's title and content
    notes[noteIndex] = { ...notes[noteIndex], title, content };
    fs.writeFileSync(NOTES_FILE, JSON.stringify(notes, null, 2));
    res.json(notes[noteIndex]);
  });  

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
