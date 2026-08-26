const mongoose = require('mongoose');

const BookIssueSchema = new mongoose.Schema({
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  issueDate: { type: Date, default: Date.now },
  dueDate: Date,
  returnDate: Date,
  fine: { type: Number, default: 0 }
});

module.exports = mongoose.model('BookIssue', BookIssueSchema);
