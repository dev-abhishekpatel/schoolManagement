const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const upload = require('../middleware/upload');
const ctrl = require('../controllers/noticeController');

router.post('/', auth, role('ADMIN','TEACHER'), upload.array('files'), ctrl.create);
router.get('/', auth, role('ADMIN','TEACHER','STUDENT','PARENT'), ctrl.getAll);
router.delete('/:id', auth, role('ADMIN','TEACHER'), ctrl.delete);

module.exports = router;
