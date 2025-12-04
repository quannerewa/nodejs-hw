import { Note } from '../models/note.js';
import createHttpError from 'http-errors';

export const getAllNotes = async (req, res) => {
  const { page = 1, perPage = 10, tag, search } = req.query;
  const skip = (page - 1) * perPage;


  let query = Note.find()
    .where('userId')
    .equals(req.user._id);

  if (tag) {
    query = query.where('tag').equals(tag);
  }

  if (search) {
    query = query.where({ $text: { $search: search } });
  }

  const [totalNotes, notes] = await Promise.all([
    Note.countDocuments(

      query.getFilter()
    ),
    query.skip(skip).limit(perPage),
  ]);

  const totalPages = Math.ceil(totalNotes / perPage);

  res.status(200).json({
    page,
    perPage,
    totalNotes,
    totalPages,
    notes,
  });
};

export const getNoteById = async (req, res, next) => {
  const { noteId } = req.params;

  const note = await Note.findOne()
    .where('_id')
    .equals(noteId)
    .where('userId')
    .equals(req.user._id);

  if (!note) {
    return next(createHttpError(404, 'Note not found'));
  }

  res.status(200).json(note);
};

export const createNote = async (req, res) => {
  const note = await Note.create({
    ...req.body,
    userId: req.user._id,
  });
  res.status(201).json(note);
};

export const deleteNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;

    const note = await Note.findOneAndDelete({
      _id: noteId,
      userId: req.user._id,
    });

    if (!note) {
      return next(createHttpError(404, 'Note not found'));
    }

    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
};

export const updateNote = async (req, res, next) => {
  const { noteId } = req.params;

  const updatedNote = await Note.findOneAndUpdate(
    {
      _id: noteId,
      userId: req.user._id,
    },
    req.body,
    { new: true }
  );

  if (!updatedNote) {
    return next(createHttpError(404, 'Note not found'));
  }

  res.status(200).json(updatedNote);
};
