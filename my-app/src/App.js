import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";


function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [expandedNotes, setExpandedNotes] = useState([]);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingContent, setEditingContent] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/notes")
      .then(response => setNotes(response.data))
      .catch(error => console.error("Error fetching notes:", error));
  }, []);

  const addNote = () => {
    if (!title || !content) return;

    axios.post("http://localhost:5000/notes", { title, content })
      .then(response => {
        setNotes([...notes, response.data]);
        setTitle("");
        setContent("");
      })
      .catch(error => console.error("Error adding note:", error));
  };

  const toggleNote = (noteId) => {
    if (expandedNotes.includes(noteId)) {
      setExpandedNotes(expandedNotes.filter(id => id !== noteId));
    } else {
      setExpandedNotes([...expandedNotes, noteId]);
    }
  };

  const deleteNote = (id) => {
    axios.delete(`http://localhost:5000/notes/${id}`)
      .then(() => {
        setNotes(notes.filter(note => note.id !== id));
      })
      .catch(error => console.error("Error deleting note:", error));
  };

  const handleEdit = (note) => {
    setEditingNoteId(note.id);
    setEditingTitle(note.title);
    setEditingContent(note.content);
  };

  const cancelEdit = () => {
    setEditingNoteId(null);
    setEditingTitle("");
    setEditingContent("");
  };

  const updateNote = (noteId) => {
    axios.put(`http://localhost:5000/notes/${noteId}`, { title: editingTitle, content: editingContent })
      .then(response => {
        setNotes(notes.map(note => note.id === noteId ? response.data : note));
        cancelEdit();
      })
      .catch(error => console.error("Error updating note:", error));
  };

  return (
    <div className="app-container">
      <h1>Notes App</h1>
      <div className="form-container">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input-title"
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="textarea-content"
        />
        <button onClick={addNote} className="btn-add">Add Note</button>
      </div>

      <div className="notes-list">
        {notes.length === 0 ? (
          <p>No notes available.</p>
        ) : (
          <ul>
            {notes.map(note => (
              <li key={note.id} className="note-item">
                <div className="note-header">
                  <h2
                    onClick={() => toggleNote(note.id)}
                    className="note-title"
                    title="Click to expand/collapse note"
                  >
                    {note.title}
                  </h2>
                  <div className="button-group">
                    <button
                      className="btn-update"
                      onClick={() => handleEdit(note)}
                      title="Click to update note"
                    >
                      ✎
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => deleteNote(note.id)}
                      title="Click to delete note"
                    >
                      X
                    </button>
                  </div>
                </div>
                {/* Show note content if expanded */}
                {expandedNotes.includes(note.id) && (<p className="note-content" >{note.content}</p>)}
                {/* Inline update form */}
                {editingNoteId === note.id && (
                  <div className="update-form">
                    <input
                      type="text"
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      className="input-edit"
                    />
                    <textarea
                      value={editingContent}
                      onChange={(e) => setEditingContent(e.target.value)}
                      className="textarea-edit"
                    />
                    <button onClick={() => updateNote(note.id)} className="btn-save">
                      Save
                    </button>
                    <button onClick={cancelEdit} className="btn-cancel">
                      Cancel
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}


export default App;
