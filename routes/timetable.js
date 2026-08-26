const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const ctrl = require('../controllers/timetableController');

router.get('/all', auth, role('ADMIN','TEACHER','STUDENT','PARENT'), ctrl.getAll);
router.get('/', auth, role('ADMIN','TEACHER','STUDENT','PARENT'), ctrl.getByClass);
router.post('/', auth, role('ADMIN'), ctrl.create);

module.exports = router;
