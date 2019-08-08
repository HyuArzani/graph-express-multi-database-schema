function getParam(req, type, param, required) {
  return new Promise((resolve, reject) => {
    switch(type)
    {
      case 'body':
      {
        if(required && !req.body[param])
          reject({message: `Missing parameters ${param} in body`});
        resolve(req.body[param]);
      }
      case 'headers':
      {
        if(required && !req.headers[param])
          reject({message: `Missing parameters ${param} in header`});
        resolve(req.headers[param]);
      }
      case 'query':
      {
        if(required && !req.headers[param])
          reject({message: `Missing parameters ${param} in query`});
        resolve(req.query[param]);
      }
    }
  })  
}

function isEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

module.exports = {
  getParam,
  isEmail
}