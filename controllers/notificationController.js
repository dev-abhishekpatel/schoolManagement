const Notification = require('../models/Notification');
const dbStore = require('../services/dbStore');

exports.create = async (req, res) => {
  try {
    const { title, message, recipientRole, recipientUser } = req.body;
    if (dbStore.isMongoConnected()) {
      const n = new Notification({
        title,
        message,
        recipientRole: recipientRole || 'ALL',
        recipientUser: recipientUser || null,
        read: false
      });
      await n.save();
      return res.status(201).json(n);
    } else {
      const newNotif = dbStore.addItem('notifications', {
        title: title || 'School Notification',
        message: message || '',
        recipientRole: recipientRole || 'ALL',
        recipientUser: recipientUser || null,
        read: false,
        createdAt: new Date().toISOString()
      });
      return res.status(201).json(newNotif);
    }
  } catch (err) {
    res.status(500).json({ msg: 'Failed to create notification', error: err.message });
  }
};

exports.getForUser = async (req, res) => {
  try {
    const role = req.user ? req.user.role : 'ALL';
    const userId = req.user ? req.user.id : null;

    if (dbStore.isMongoConnected()) {
      const list = await Notification.find({
        $or: [{ recipientRole: 'ALL' }, { recipientRole: role }, { recipientUser: userId }]
      }).sort({ createdAt: -1 });
      return res.json(list);
    } else {
      const all = dbStore.getCollection('notifications');
      const filtered = all.filter(n => n.recipientRole === 'ALL' || n.recipientRole === role || String(n.recipientUser) === String(userId));
      return res.json(filtered);
    }
  } catch (err) {
    const all = dbStore.getCollection('notifications');
    return res.json(all);
  }
};

exports.markRead = async (req, res) => {
  try {
    if (dbStore.isMongoConnected()) {
      const n = await Notification.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
      if (!n) return res.status(404).json({ msg: 'Notification not found' });
      return res.json(n);
    } else {
      const updated = dbStore.updateItem('notifications', req.params.id, { read: true });
      if (!updated) return res.status(404).json({ msg: 'Notification not found' });
      return res.json(updated);
    }
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};
