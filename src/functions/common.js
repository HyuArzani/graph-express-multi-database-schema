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

module.exports = {
  getParam
}