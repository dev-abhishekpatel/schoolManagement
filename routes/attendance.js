const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const ctrl = require('../controllers/attendanceController');

router.post('/', auth, role('TEACHER','ADMIN'), ctrl.mark);
router.post('/bulk', auth, role('TEACHER','ADMIN'), ctrl.bulkMark);
router.get('/', auth, role('TEACHER','ADMIN','PARENT','STUDENT'), ctrl.getByClassDate);
router.put('/:id', auth, role('TEACHER','ADMIN'), ctrl.update);

module.exports = router;
