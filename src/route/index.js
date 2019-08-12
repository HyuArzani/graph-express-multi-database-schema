const express = require('express');
const router = express.Router();
const {
  refreshToken,
  register,
  login
} = require('rest');
const authMiddleware = require('../middleware/auth');

router.get('/', async (req,res) => {
  return res.send('Ok');
})

router.post('/login', login)
router.post('/refreshToken', refreshToken)
router.post('/register', register)

router.get('/secure', authMiddleware, (req,res) => {
  res.send('SECURE');
})

module.exports = router;