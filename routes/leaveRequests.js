const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const ctrl = require('../controllers/leaveController');

router.get('/', auth, role('ADMIN','TEACHER','STUDENT','PARENT'), ctrl.getLeaves);
router.post('/', auth, role('TEACHER','STUDENT','ADMIN','PARENT'), ctrl.requestLeave);
router.put('/:id/review', auth, role('ADMIN','TEACHER'), ctrl.review);
router.delete('/:id', auth, role('ADMIN','TEACHER'), ctrl.deleteLeave);

module.exports = router;
