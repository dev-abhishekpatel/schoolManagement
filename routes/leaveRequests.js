const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const ctrl = require('../controllers/leaveController');

router.post('/', auth, role('TEACHER','STUDENT'), ctrl.requestLeave);
router.put('/:id/review', auth, role('ADMIN','TEACHER'), ctrl.review);

module.exports = router;
