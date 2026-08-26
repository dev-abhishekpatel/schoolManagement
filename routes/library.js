const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const ctrl = require('../controllers/libraryController');

router.post('/books', auth, role('ADMIN'), ctrl.addBook);
router.post('/issue', auth, role('ADMIN','TEACHER'), ctrl.issueBook);
router.post('/return/:id', auth, role('ADMIN','TEACHER'), ctrl.returnBook);

module.exports = router;
