const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const ctrl = require('../controllers/notificationController');

router.post('/', auth, role('ADMIN','TEACHER'), ctrl.create);
router.get('/', auth, ctrl.getForUser);

module.exports = router;
