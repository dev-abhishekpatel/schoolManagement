const Book = require('../models/Book');
const BookIssue = require('../models/BookIssue');
const dbStore = require('../services/dbStore');

exports.getBooks = async (req, res) => {
  try {
    if (dbStore.isMongoConnected()) {
      const books = await Book.find().sort({ createdAt: -1 });
      return res.json(books);
    } else {
      const books = dbStore.getCollection('books');
      return res.json(books);
    }
  } catch (err) {
    const books = dbStore.getCollection('books');
    return res.json(books);
  }
};

exports.addBook = async (req, res) => {
  try {
    const { title, author, category, isbn, copies } = req.body;
    const copiesNum = copies ? Number(copies) : 1;

    if (dbStore.isMongoConnected()) {
      const book = new Book({
        title,
        author: author || 'Unknown Author',
        category: category || 'General',
        isbn: isbn || `978-${Math.floor(100000000 + Math.random() * 900000000)}`,
        copies: copiesNum
      });
      await book.save();
      return res.status(201).json(book);
    } else {
      const newBook = dbStore.addItem('books', {
        title,
        author: author || 'Unknown Author',
        category: category || 'General',
        isbn: isbn || `978-${Math.floor(100000000 + Math.random() * 900000000)}`,
        copies: copiesNum,
        available: copiesNum
      });
      return res.status(201).json(newBook);
    }
  } catch (err) {
    res.status(500).json({ msg: 'Failed to save book to Database', error: err.message });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    if (dbStore.isMongoConnected()) {
      const book = await Book.findByIdAndDelete(req.params.id);
      if (!book) return res.status(404).json({ msg: 'Book not found' });
      return res.json({ msg: 'Book deleted from Database' });
    } else {
      const deleted = dbStore.deleteItem('books', req.params.id);
      if (!deleted) return res.status(404).json({ msg: 'Book not found' });
      return res.json({ msg: 'Book deleted from Database' });
    }
  } catch (err) {
    res.status(500).json({ msg: 'Failed to delete book from Database', error: err.message });
  }
};

exports.getIssues = async (req, res) => {
  try {
    if (dbStore.isMongoConnected()) {
      const issues = await BookIssue.find().populate('book student').sort({ issueDate: -1 });
      return res.json(issues);
    } else {
      const issues = dbStore.getCollection('bookIssues');
      return res.json(issues);
    }
  } catch (err) {
    const issues = dbStore.getCollection('bookIssues');
    return res.json(issues);
  }
};

exports.issueBook = async (req, res) => {
  try {
    const { bookId, studentId, bookTitle, studentName, dueDate } = req.body;

    if (dbStore.isMongoConnected()) {
      const issue = new BookIssue({
        book: bookId,
        student: studentId,
        issueDate: new Date(),
        dueDate: dueDate ? new Date(dueDate) : new Date(Date.now() + 14 * 86400000)
      });
      await issue.save();
      return res.status(201).json(issue);
    } else {
      const books = dbStore.getCollection('books');
      const bObj = books.find(b => String(b._id || b.id) === String(bookId));
      if (bObj && (bObj.available > 0 || bObj.copies > 0)) {
        dbStore.updateItem('books', bObj._id || bObj.id, { available: Math.max(0, (bObj.available || bObj.copies) - 1) });
      }

      const newIssue = dbStore.addItem('bookIssues', {
        book: bookId,
        bookTitle: bookTitle || (bObj ? bObj.title : 'Book Title'),
        student: studentId || 'stu_1',
        studentName: studentName || 'Aarav Kumar',
        issueDate: new Date().toISOString().split('T')[0],
        dueDate: dueDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
        returnDate: null,
        status: 'ISSUED'
      });
      return res.status(201).json(newIssue);
    }
  } catch (err) {
    res.status(500).json({ msg: 'Failed to issue book in Database', error: err.message });
  }
};

exports.returnBook = async (req, res) => {
  try {
    if (dbStore.isMongoConnected()) {
      const issue = await BookIssue.findById(req.params.id);
      if (!issue) return res.status(404).json({ msg: 'Issue record not found' });
      issue.returnDate = new Date();
      await issue.save();
      return res.json(issue);
    } else {
      const updated = dbStore.updateItem('bookIssues', req.params.id, {
        returnDate: new Date().toISOString().split('T')[0],
        status: 'RETURNED'
      });
      if (!updated) return res.status(404).json({ msg: 'Issue record not found' });

      // restore available copies in books collection
      if (updated.book) {
        const books = dbStore.getCollection('books');
        const bObj = books.find(b => String(b._id || b.id) === String(updated.book));
        if (bObj) {
          dbStore.updateItem('books', bObj._id || bObj.id, { available: (bObj.available || 0) + 1 });
        }
      }
      return res.json(updated);
    }
  } catch (err) {
    res.status(500).json({ msg: 'Failed to return book in Database', error: err.message });
  }
};
