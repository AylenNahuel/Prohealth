const authService = require('../services/auth.service');
const { signToken } = require('../utils/jwt');

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.authenticate(email, password);
  const token = signToken({ sub: user.id, email: user.email, role: user.role });
  res.json({
    token,
    user,
  });
};

module.exports = {
  login,
};
