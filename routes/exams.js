const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const ctrl = require('../controllers/examController');

router.get('/', auth, role('ADMIN','TEACHER'), ctrl.getAll);
router.get('/:id', auth, role('ADMIN','TEACHER','STUDENT','PARENT'), ctrl.getById);
router.post('/', auth, role('ADMIN'), ctrl.create);
router.put('/:id', auth, role('ADMIN'), ctrl.update);
router.delete('/:id', auth, role('ADMIN'), ctrl.delete);

module.exports = router;
