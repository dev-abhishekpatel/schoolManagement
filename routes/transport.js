const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const ctrl = require('../controllers/transportController');

router.get('/buses', auth, role('ADMIN','TEACHER','STUDENT','PARENT'), ctrl.getBuses);
router.post('/buses', auth, role('ADMIN'), ctrl.addBus);
router.delete('/buses/:id', auth, role('ADMIN'), ctrl.deleteBus);

router.get('/routes', auth, role('ADMIN','TEACHER','STUDENT','PARENT'), ctrl.getRoutes);
router.post('/routes', auth, role('ADMIN'), ctrl.addRoute);

module.exports = router;
