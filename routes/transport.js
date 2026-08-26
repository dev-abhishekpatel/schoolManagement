const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const ctrl = require('../controllers/transportController');

router.post('/routes', auth, role('ADMIN'), ctrl.addRoute);
router.post('/buses', auth, role('ADMIN'), ctrl.addBus);

module.exports = router;
