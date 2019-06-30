import jwt from 'jsonwebtoken';

const auth = {
  generateToken(user) {
    return jwt.sign({
      id: user.id,
      email: user.email,
    }, process.env.SECRET, { expiresIn: '7d' });
  },

  verifyToken(token) {
    let decoded = {};
    try {
      decoded.payload = jwt.verify(token, process.env.SECRET);
    } catch (error) {
      decoded = { error: error.message };
    }
    return decoded;
  },
};

export default auth;
