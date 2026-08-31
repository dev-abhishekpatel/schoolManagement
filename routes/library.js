const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const ctrl = require('../controllers/libraryController');

router.get('/books', auth, role('ADMIN','TEACHER','STUDENT','PARENT'), ctrl.getBooks);
router.post('/books', auth, role('ADMIN'), ctrl.addBook);
router.delete('/books/:id', auth, role('ADMIN'), ctrl.deleteBook);
router.get('/issues', auth, role('ADMIN','TEACHER','STUDENT','PARENT'), ctrl.getIssues);
router.post('/issue', auth, role('ADMIN','TEACHER'), ctrl.issueBook);
router.post('/return/:id', auth, role('ADMIN','TEACHER'), ctrl.returnBook);

module.exports = router;
