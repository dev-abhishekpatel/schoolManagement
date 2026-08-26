const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const ctrl = require('../controllers/authController');

router.post(
  '/register',
  [
    body('name').notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 6 })
  ],
  ctrl.register
);

router.post(
  '/login',
  [body('email').isEmail(), body('password').exists()],
  ctrl.login
);

router.get('/me', auth, ctrl.getMe);
router.post('/seed', ctrl.seedDatabase);

module.exports = router;
