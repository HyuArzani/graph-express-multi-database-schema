require('dotenv').config();
const { getParam } = require('functions/common');

const tryLogin = require('controllers/auth/login');
const tryRegister = require('controllers/auth/register');
const tryRefreshToken = require('controllers/auth/refreshToken');

const login = async (req, res) => {
  var params = {};
  // check required params
  try {
    params = {
      username: await getParam(req, 'body', 'username', true),
      password: await getParam(req, 'body', 'password', true),
      origin: await getParam(req, 'body', 'origin', true),
      device: await getParam(req, 'body', 'device'),
      os: await getParam(req, 'body', 'os'),
      location: await getParam(req, 'body', 'location'),
    }
  } catch(e) {
    res.status(422).json({status: 'FAILED', message: e.message});
  }

  try {
    const result = await tryLogin(params)
    res.status(result.code).json({status: result.status, data: result.data});
  } catch(error) {
    res.status(error.code).json({status: error.status, message: error.message});
  }
}

const register = async (req, res) => {
  var params = {};
  // check required params
  try {
      params = {
          email: await getParam(req, 'body', 'email'),
          phone: await getParam(req, 'body', 'phone'),
          password: await getParam(req, 'body', 'password', true),
          fullName: await getParam(req, 'body', 'fullName'),
          identityNumber: await getParam(req, 'body', 'identityNumber'),
          nation: await getParam(req, 'body', 'nation'),
          cities: await getParam(req, 'body', 'cities'),
          gender: await getParam(req, 'body', 'gender'),
          dateOfBirth: await getParam(req, 'body', 'dateOfBirth'),
          origin: await getParam(req, 'body', 'origin', true),

          device: await getParam(req, 'body', 'device'),
          os: await getParam(req, 'body', 'os'),
          location: await getParam(req, 'body', 'location'),
      }
  } catch(e) {
      res.status(422).json({
          status: 'FAILED',
          message: e.message
      });
      return;
  }
  try {
    const result = await tryRegister(params)
    res.status(result.code).json({status: result.status, data: result.data});
  } catch(error) {
    res.status(error.code).json({status: error.status, message: error.message});
  }
}

const refreshToken = async (req, res) => {
  var params = {};
  // refresh the damn token
  try {
    params = {
      refreshToken: await getParam(req, 'headers', 'refresh-token', true),
    };
  } catch(e) {
    res.status(422).json({status: 'FAILED', message: e.message});
    return;
  }
  try {
    const result = await tryRefreshToken(params.refreshToken)
    res.status(result.code).json({status: result.status, data: result.data});
  } catch(error) {
    res.status(error.code).json({status: error.status, message: error.message});
  }
}

module.exports = {
  login,
  register,
  refreshToken
}