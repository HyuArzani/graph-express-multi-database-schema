require('dotenv').config();
const uuid = require('uuid/v1');
const hash = require('object-hash');
const { isEmail } = require('functions/common');
const jwt = require('jsonwebtoken');
const knexConfig = require('db/knexfile');
const R = require('ramda');
const moment = require('moment');
// const { InsertHelper } = require('functions/dbFunctions');
const knex = require('knex')(knexConfig.development);

const tryRegister = async (params) => {
    if(!params.email && !params.phone) {
        return Promise.reject({code: 422, status: 'FAILED', message: 'Missing Parameters email or phone'});
    }
    if(!params.origin) {
        return Promise.reject({code: 422, status: 'FAILED', message: 'Missing Parameters origin'});
    }
    // check duplicate email
    if(params.email) {
        let userEmail = [];
        try {
            userEmail = await knex('users').where('email', params.email);
        } catch(e) {
            return Promise.reject({code: 500, status: 'FAILED', message: 'Failed when getting email'});
        }
        if(!isEmail(params.email)) {
            return Promise.reject({code: 403, status: 'FAILED', message: 'Email format are wrong'});
        }
        if(!R.isEmpty(userEmail)) {
            return Promise.reject({code: 403, status: 'FAILED', message: 'Email already registered, please login'});
        }
    }
    // check duplicate phone
    if(params.phone) {
        let userPhone = [];
        try {
            userPhone = await knex('users').where('phone', params.phone);
        } catch(e) {
            return Promise.reject({code: 500, status: 'FAILED', message: 'Failed when getting phone'});
        }
        if(!R.isEmpty(userPhone)) {
            return Promise.reject({code: 403, status: 'FAILED', message: 'Phone already registered, please login'});
        }
    }
    // do the database authentication here, with user name and password combination.
    const tokenId = uuid();
    const userId = uuid();
    const response = {
        token: jwt.sign({userId, email: params.email, phone: params.phone, full_name: params.fullName}, process.env.TOKEN_SECRET, { expiresIn: process.env.TOKEN_LIFE}),
        refreshToken: jwt.sign({userId, email: params.email, phone: params.phone, full_name: params.fullName}, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_LIFE})
    }
    const time = moment(params.dateOfBirth).format("YYYY-MM-DD HH:mm:ss");
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
            date_of_birth: time,
            is_phone_verified: false,
            is_email_verified: false,
        });
    } catch(e) {
        return Promise.reject({code: 500, status: 'FAILED', message: 'Insert into table users failed'});
    }
  
    try {
        await Promise.all([
            knex('tokens').insert({
                userId,
                tokenId,
                token: response.token,
                refreshToken: response.refreshToken,
            }),
            knex('userTypes').insert({
                userId,
                tokenId,
                origin: params.origin,
            }),
            knex('verifications').insert({
              verificationId: uuid(),
              userId,
              code: Math.floor(1000 + Math.random() * 9000).toString(),
              type: 'SMS',
              count: 1,
            }),
            knex('verifications').insert({
              verificationId: uuid(),
              userId,
              code: Math.random().toString(36).substring(2,10),//8 random char //Math.floor(Math.random() * (100000000 - 1) + 1),
              type: 'EMAIL',
              count: 1,
            }),
            (params.device || params.os || params.location) ? knex('identifiers').insert({
                identifierId: uuid(),
                userId,
                device: params.device,
                os: params.os,
                location: params.location
            }) : Promise.resolve()
        ])
    } catch(e) {
        return Promise.reject({code: 500, status: 'FAILED', message: 'Insert into table tokens/verifications failed'});
    }
    return Promise.resolve({code: 200, status: 'OK', data: response});
} 

module.exports = tryRegister