const Notice = require('../models/Notice');

exports.create = async (req, res) => {
  try {
    const { title, body, content, target, audience } = req.body;
    const notice = new Notice({
      title: title || 'School Announcement',
      body: body || content || '',
      target: target || audience || 'ALL',
      createdBy: req.user ? req.user.id : null
    });
    await notice.save();
    const populated = await Notice.findById(notice._id).populate('createdBy targetClass');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to save notice to MongoDB', error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const notices = await Notice.find().populate('createdBy targetClass').sort({ createdAt: -1 });
    res.json(notices);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch notices from MongoDB', error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    await Notice.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Notice deleted from MongoDB' });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to delete notice from MongoDB', error: err.message });
  }
};
