const Notification = require('../models/Notification');

exports.create = async (req, res) => {
  try {
    const n = new Notification({ ...req.body });
    await n.save();
    res.status(201).json(n);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.getForUser = async (req, res) => {
  try {
    const role = req.user.role;
    const list = await Notification.find({ $or: [{ recipientRole: 'ALL' }, { recipientRole: role }, { recipientUser: req.user.id }] }).sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).send('Server error');
  }
};
