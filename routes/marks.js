const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const ctrl = require('../controllers/markController');

router.post('/', auth, role('TEACHER','ADMIN'), ctrl.create);
router.put('/:id', auth, role('TEACHER','ADMIN'), ctrl.update);
router.get('/student/:studentId', auth, role('ADMIN','TEACHER','STUDENT','PARENT'), ctrl.getByStudent);

module.exports = router;
