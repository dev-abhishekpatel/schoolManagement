const Notification = require('../models/Notification');

exports.create = async (req, res) => {
  try {
    const n = new Notification({ ...req.body });
    await n.save();
    res.status(201).json(n);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

exports.getForUser = async (req, res) => {
  try {
    const role = req.user ? req.user.role : 'ALL';
    const list = await Notification.find({
      $or: [{ recipientRole: 'ALL' }, { recipientRole: role }, { recipientUser: req.user ? req.user.id : null }]
    }).sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

exports.markRead = async (req, res) => {
  try {
    const n = await Notification.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    res.json(n);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};
