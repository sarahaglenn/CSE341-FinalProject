const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  //   const authHeader = req.headers['authorization'];
  const token =
    req.cookies.authToken ||
    (req.headers['authorization'] &&
      req.headers['authorization'].startsWith('Bearer ') &&
      req.headers['authorization'].split(' ')[1]);

  if (!token) return res.status(401).json({ message: 'Unauthorized access. Please log in' });

  try {
    const verified = jwt.verify(token, process.env.SECRET_KEY);
    req.user = verified;
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid Token', err });
  }
};
