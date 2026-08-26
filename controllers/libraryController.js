const Book = require('../models/Book');
const BookIssue = require('../models/BookIssue');

exports.addBook = async (req, res) => {
  try {
    const book = new Book(req.body);
    await book.save();
    res.status(201).json(book);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.issueBook = async (req, res) => {
  try {
    const issue = new BookIssue(req.body);
    await issue.save();
    res.status(201).json(issue);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.returnBook = async (req, res) => {
  try {
    const issue = await BookIssue.findById(req.params.id);
    if (!issue) return res.status(404).json({ msg: 'Issue not found' });
    issue.returnDate = new Date();
    await issue.save();
    res.json(issue);
  } catch (err) {
    res.status(500).send('Server error');
  }
};
