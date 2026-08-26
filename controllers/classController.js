const ClassModel = require('../models/Class');

exports.getAll = async (req, res) => {
  try {
    const classes = await ClassModel.find();
    res.json(classes);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.getById = async (req, res) => {
  try {
    const cls = await ClassModel.findById(req.params.id);
    if (!cls) return res.status(404).json({ msg: 'Class not found' });
    res.json(cls);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.create = async (req, res) => {
  try {
    const data = req.body;
    const cls = new ClassModel(data);
    await cls.save();
    res.status(201).json(cls);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.update = async (req, res) => {
  try {
    const cls = await ClassModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!cls) return res.status(404).json({ msg: 'Class not found' });
    res.json(cls);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.delete = async (req, res) => {
  try {
    const cls = await ClassModel.findByIdAndDelete(req.params.id);
    if (!cls) return res.status(404).json({ msg: 'Class not found' });
    res.json({ msg: 'Class removed' });
  } catch (err) {
    res.status(500).send('Server error');
  }
};
