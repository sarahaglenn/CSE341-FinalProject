const jwt = require('jsonwebtoken');

const login = async (profile) => {
  const { id: googleId, displayName, emails } = profile;
  const email = emails?.[0]?.value;

  try {
    const tokenPayload = { googleId, name: displayName, email };
    const authToken = jwt.sign(tokenPayload, process.env.SECRET_KEY, { expiresIn: '1h' });

    return { authToken };
  } catch (error) {
    console.error('Error handling google login:', error);
    throw error;
  }
};

const logout = (req, res) => {
  res.clearCookie('authToken');
  res.json({
    success: true,
    message: 'Logged out successfully.'
  });
};

module.exports = { login, logout };
