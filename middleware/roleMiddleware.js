module.exports = function (...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !req.user.role) return res.status(401).json({ msg: 'Unauthorized' });
    if (allowedRoles.length === 0) return next();
    if (allowedRoles.includes(req.user.role)) return next();
    return res.status(403).json({ msg: 'Forbidden: insufficient role' });
  };
};
