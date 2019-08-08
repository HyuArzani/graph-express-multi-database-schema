const jwt = require('jsonwebtoken')
const config = require('configs')

module.exports = (req,res,next) => {
  const Bearer = req.body.authorization || req.query.authorization || req.headers['authorization']
  // decode token
  if (Bearer) {
    const token = Bearer.replace('Bearer ', '');
    // verifies secret and checks exp
    jwt.verify(token, config.secret, function(err, decoded) {
        if (err) {
          return res.status(401).json({"error": true, "message": 'Unauthorized access.' });
        }
      req.decoded = decoded;
      next();
    });
  } else {
    // if there is no token
    // return an error
    return res.status(403).send({
        "error": true,
        "message": 'No Authorization provided.'
    });
  }
}