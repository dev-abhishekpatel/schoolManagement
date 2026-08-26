const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const ctrl = require('../controllers/reportController');

router.get('/students', auth, role('ADMIN','TEACHER'), ctrl.studentReport);
router.get('/attendance', auth, role('ADMIN','TEACHER'), ctrl.attendanceSummary);

module.exports = router;
