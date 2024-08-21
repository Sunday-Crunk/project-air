const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const uuid = require('uuid');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const NOTES_DIR = path.join(__dirname, 'notes');
const METADATA_FILE = path.join(__dirname, 'metadata.json');

// Helper function to ensure the notes directory exists
async function ensureNotesDir() {
  try {
    await fs.mkdir(NOTES_DIR, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') throw error;
  }
}

// Helper function to read metadata
async function readMetadata() {
  try {
    const data = await fs.readFile(METADATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // If file doesn't exist, return an empty object
      return {};
    }
    throw error;
  }
}

// Helper function to write metadata
async function writeMetadata(metadata) {
  await fs.writeFile(METADATA_FILE, JSON.stringify(metadata, null, 2));
}

// Helper function to read a note
async function readNote(id) {
  const filePath = path.join(NOTES_DIR, `${id}.txt`);
  return fs.readFile(filePath, 'utf8');
}

// Helper function to write a note
async function writeNote(id, content) {
  const filePath = path.join(NOTES_DIR, `${id}.txt`);
  await fs.writeFile(filePath, content);
}

// CRUD Routes

// Create a new note
app.post('/api/notes', async (req, res) => {
  try {
    await ensureNotesDir();
    const metadata = await readMetadata();
    const id = uuid.v4();
    const newNote = {
      id,
      title: req.body.title,
      status: req.body.status,
      category: req.body.category,
      preview: req.body.content.length > 100 ? req.body.content.slice(0, 100) : req.body.content,
      createdAt: new Date().toISOString()
    };
    metadata[id] = newNote;
    await writeMetadata(metadata);
    await writeNote(id, req.body.content);
    res.status(201).json(newNote);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create note' });
  }
});

// Read all notes (metadata only)
app.get('/api/notes', async (req, res) => {
    try {
      const metadata = await readMetadata();
      res.json(Object.values(metadata));
    } catch (error) {
      console.error("Error fetching notes:", error); // Log the error for debugging
      res.status(500).json({
        message: "An error occurred while fetching notes.",
        error: error.message || "Unknown Error", // Send error message
        stack: error.stack || "No stack trace available", // Include stack trace if available
      });
    }
  });
  

// Read a specific note
app.get('/api/notes/:id', async (req, res) => {
  try {
    const metadata = await readMetadata();
    const noteMetadata = metadata[req.params.id];
    if (!noteMetadata) {
      return res.status(404).json({ error: 'Note not found' });
    }
    const content = await readNote(req.params.id);
    res.json({ ...noteMetadata, content });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error });
  }
});

// Update a note
app.put('/api/notes/:id', async (req, res) => {
  try {
    const metadata = await readMetadata();
    if (!metadata[req.params.id]) {
      return res.status(404).json({ error: 'Note not found' });
    }
    const preview = req.body.content ? req.body.content.length > 100 ? req.body.content.slice(0, 100) : req.body.content : metadata[req.params.id].preview;
    metadata[req.params.id] = {
      ...metadata[req.params.id],
      title: req.body.title,
      status: req.body.status,
      category: req.body.category,
      preview,
      updatedAt: new Date().toISOString()
    };
    await writeMetadata(metadata);
    if (req.body.content) {
      await writeNote(req.params.id, req.body.content);
    }
    //await writeNote(req.params.id, req.body.content);
    res.json(metadata[req.params.id]);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Failed to update note: ' + error.message });
  }
});

// Delete a note
app.delete('/api/notes/:id', async (req, res) => {
  try {
    const metadata = await readMetadata();
    if (!metadata[req.params.id]) {
      return res.status(404).json({ error: 'Note not found' });
    }
    delete metadata[req.params.id];
    await writeMetadata(metadata);
    await fs.unlink(path.join(NOTES_DIR, `${req.params.id}.txt`));
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

module.exports = app;