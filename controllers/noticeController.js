const Notice = require('../models/Notice');
const { uploadBuffer } = require('../services/cloudinary');

exports.create = async (req, res) => {
  try {
    const files = [];
    if (req.files && req.files.length) {
      for (const f of req.files) {
        const result = await uploadBuffer(f.buffer, 'notices');
        files.push(result.secure_url);
      }
    }
    const notice = new Notice({ ...req.body, attachments: files, createdBy: req.user.id });
    await notice.save();
    res.status(201).json(notice);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.getAll = async (req, res) => {
  try {
    const notices = await Notice.find().populate('createdBy targetClass');
    res.json(notices);
  } catch (err) {
    res.status(500).send('Server error');
  }
};
