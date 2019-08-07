const express = require('express');
const router = express.Router();
const { login, refreshToken } = require('../controllers/auth');
const authMiddleware = require('../middleware/auth');

router.get('/', async (req,res) => {
  return res.send('Ok');
})

router.post('/login', login)
router.post('/token', refreshToken)

router.get('/secure', authMiddleware, (req,res) => {
  console.log('SIJEMBUT = ', req);
  // all secured routes goes here
  // var jembut = req;
  // res.status(200).json(jembut);
  res.send('SIJEMBUT');
})

module.exports = router;