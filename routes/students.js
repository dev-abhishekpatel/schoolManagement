const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const ctrl = require('../controllers/studentController');

router.get('/', auth, role('ADMIN','TEACHER'), ctrl.getAll);
router.get('/:id', auth, ctrl.getById);

router.post(
  '/',
  auth,
  role('ADMIN','TEACHER'),
  [body('name').notEmpty()],
  ctrl.create
);

router.put('/:id', auth, role('ADMIN','TEACHER'), ctrl.update);
router.delete('/:id', auth, role('ADMIN'), ctrl.delete);

module.exports = router;
