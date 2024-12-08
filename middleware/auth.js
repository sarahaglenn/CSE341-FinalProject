const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized access. Please log in.' });
  }

  try {
    const verified = jwt.verify(token, process.env.SECRET_KEY);
    req.user = verified; // Attach user data from token
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid Token', err });
  }
};
