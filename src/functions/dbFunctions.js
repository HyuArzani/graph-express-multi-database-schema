const knex = require('knex');
const moment = require('moment');

function InsertHelper(date) {
  if(!moment(date).isValid())
  {
    console.error('Not valid date format');
    return {
      created_at: new Date(),
      updated_at: new Date(),
    };
  }
  return {
    created_at: date,
    updated_at: date,
  }
}

module.exports = {
  InsertHelper
}