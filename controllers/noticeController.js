const Notice = require('../models/Notice');
const dbStore = require('../services/dbStore');

exports.create = async (req, res) => {
  try {
    const { title, body, content, target, audience } = req.body;
    if (dbStore.isMongoConnected()) {
      const notice = new Notice({
        title: title || 'School Announcement',
        body: body || content || '',
        target: target || audience || 'ALL',
        createdBy: req.user ? req.user.id : null
      });
      await notice.save();
      const populated = await Notice.findById(notice._id).populate('createdBy targetClass');
      return res.status(201).json(populated);
    } else {
      const newNotice = dbStore.addItem('notices', {
        title: title || 'School Announcement',
        body: body || content || '',
        content: body || content || '',
        target: target || audience || 'ALL',
        audience: target || audience || 'ALL',
        createdAt: new Date().toISOString()
      });
      return res.status(201).json(newNotice);
    }
  } catch (err) {
    res.status(500).json({ msg: 'Failed to save notice to Database', error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    if (dbStore.isMongoConnected()) {
      const notices = await Notice.find().populate('createdBy targetClass').sort({ createdAt: -1 });
      return res.json(notices);
    } else {
      const notices = dbStore.getCollection('notices');
      return res.json(notices);
    }
  } catch (err) {
    const notices = dbStore.getCollection('notices');
    return res.json(notices);
  }
};

exports.delete = async (req, res) => {
  try {
    if (dbStore.isMongoConnected()) {
      await Notice.findByIdAndDelete(req.params.id);
      return res.json({ msg: 'Notice deleted from Database' });
    } else {
      dbStore.deleteItem('notices', req.params.id);
      return res.json({ msg: 'Notice deleted from Database' });
    }
  } catch (err) {
    res.status(500).json({ msg: 'Failed to delete notice from Database', error: err.message });
  }
};

