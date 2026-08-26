const Book = require('../models/Book');
const BookIssue = require('../models/BookIssue');

exports.getBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch books from MongoDB', error: err.message });
  }
};

exports.addBook = async (req, res) => {
  try {
    const { title, author, category, isbn, copies } = req.body;
    const book = new Book({
      title,
      author: author || 'Unknown Author',
      category: category || 'General',
      isbn: isbn || `978-${Math.floor(100000000 + Math.random() * 900000000)}`,
      copies: copies ? Number(copies) : 1
    });
    await book.save();
    res.status(201).json(book);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to save book to MongoDB', error: err.message });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Book deleted from MongoDB' });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to delete book from MongoDB', error: err.message });
  }
};

exports.issueBook = async (req, res) => {
  try {
    const issue = new BookIssue({
      ...req.body,
      issueDate: new Date()
    });
    await issue.save();
    res.status(201).json(issue);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

exports.returnBook = async (req, res) => {
  try {
    const issue = await BookIssue.findById(req.params.id);
    if (!issue) return res.status(404).json({ msg: 'Issue record not found' });
    issue.returnDate = new Date();
    await issue.save();
    res.json(issue);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};
