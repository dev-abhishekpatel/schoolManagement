const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const ctrl = require('../controllers/feeController');

router.post('/', auth, role('ADMIN'), ctrl.createFee);
router.get('/', auth, role('ADMIN','TEACHER'), ctrl.getFees);
router.post('/payments', auth, role('PARENT','STUDENT','ADMIN'), ctrl.createPayment);
router.get('/payments', auth, role('ADMIN','TEACHER','PARENT','STUDENT'), ctrl.getPayments);

module.exports = router;
