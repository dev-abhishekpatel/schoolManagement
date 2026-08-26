const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const ctrl = require('../controllers/timetableController');

router.post('/', auth, role('ADMIN'), ctrl.create);
router.get('/', auth, role('ADMIN','TEACHER','STUDENT','PARENT'), ctrl.getByClass);

module.exports = router;
