const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const upload = require('../middleware/upload');
const ctrl = require('../controllers/assignmentController');

router.post('/', auth, role('TEACHER','ADMIN'), upload.array('files'), ctrl.create);
router.get('/', auth, role('ADMIN','TEACHER','STUDENT','PARENT'), ctrl.getAll);
router.post('/:id/submit', auth, role('STUDENT'), upload.array('files'), ctrl.submit);

module.exports = router;
