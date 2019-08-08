require('dotenv').config();
const uuid = require('uuid/v1');
const hash = require('object-hash');
const moment = require('moment');
const { getParam } = require('functions/common');
// const config = require('configs');
const jwt = require('jsonwebtoken');
const knexConfig = require('db/knexfile');
const R = require('ramda');
const { InsertHelper } = require('functions/dbFunctions');
const knex = require('knex')(knexConfig.development);

const login = (req, res) => {
  const postData = req.body;
  const user = {
      "email": postData.email,
      "name": postData.name
  }
  // do the database authentication here, with user name and password combination.
  const token = jwt.sign(user, process.env.TOKEN_SECRET, { expiresIn: process.env.TOKEN_LIFE})
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_LIFE})
  const response = {
      "status": "Logged in",
      "token": token,
      "refreshToken": refreshToken,
  }
  // get users from database
  // assert.property(req, 'knex')
  // tokenList[refreshToken] = response
  res.status(200).json(response);
}

const refreshToken = (req, res) => {
  // refresh the damn token
  const postData = req.body
  // if refresh token exists
  if((postData.refreshToken) && (postData.refreshToken in tokenList)) {
      const user = {
          "email": postData.email,
          "name": postData.name
      }
      const token = jwt.sign(user, config.secret, { expiresIn: config.tokenLife})
      const response = {
          "token": token,
      }
      // update the token in the list
      tokenList[postData.refreshToken].token = token
      res.status(200).json(response);        
  } else {
      res.status(404).send('Invalid request')
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
        }
    } catch(e) {
        res.status(422).json({
            status: 'FAILED',
            message: e.message
        });
        return;
    }
    if(!params.email && !params.phone) {
        res.status(422).json({ errors: "Missing parameter email or phone" });
        return;
    }
    // check duplicate email
    if(params.email) {
        let userEmail = [];
        try {
            userEmail = await knex('users').where('email', params.email);
        } catch(e) {
            console.error('ERROR WHEN GETTING EMAIL', e);
        }
        if(!R.isEmpty(userEmail)) {
            res.status(403).json({ errors: "Email already registered, please login" });
            return;
        }
    }
    // check duplicate phone
    if(params.phone) {
        let userPhone = [];
        try {
            userPhone = await knex('users').where('phone', params.phone);
        } catch(e) {
            console.error('ERROR WHEN GETTING PHONE', e);
        }
        if(!R.isEmpty(userPhone)) {
            res.status(403).json({ errors: "Phone already registered, please login" });
            return;
        }
    }

    // do the database authentication here, with user name and password combination.
    const tokenId = uuid();
    const userId = uuid();
    const response = {
        userId,
        token: jwt.sign({userId}, process.env.TOKEN_SECRET, { expiresIn: process.env.TOKEN_LIFE}),
        refreshToken: jwt.sign({userId}, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_LIFE})
    }

    try {
        await knex('users').insert({
            userId,
            email: params.email,
            phone: params.phone,
            password: hash(params.password),
            full_name: params.fullName,
            identity_number: params.identityNumber,
            nation: params.nation,
            cities: params.cities,
            gender: params.gender,
            origin: params.origin,
            date_of_birth: params.dateOfBirth,
        });
    } catch(e) {
        console.error('INSERT INTO TABLE USERS FAILED');
        res.status(500).json({status: 'FAILED', message: 'Insert into table users failed'}); 
    }

    try {
        await knex('tokens').insert({
            userId,
            tokenId,
            token: response.token,
            refreshToken: response.refreshToken,
        });
    } catch(e) {
        console.error('INSERT INTO TABLE TOKENS FAILED');
        res.status(500).json({status: 'FAILED', message: 'Insert into table tokens failed'});
    }

    try {
        await knex('userTypes').insert({
            userId,
            tokenId,
            origin: params.origin,
        });
    } catch(e) {
        console.error('INSERT INTO TABLE USERTYPE FAILED');
        res.status(500).json({status: 'FAILED', message: 'Insert into table userTypes failed'});
    }
    
    res.status(200).json({status: 'OK', response});  
}

module.exports = {
  login,
  refreshToken,
  register
}