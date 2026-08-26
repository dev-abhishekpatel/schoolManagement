const Mark = require('../models/Mark');

exports.getByStudent = async (req, res) => {
  try {
    const marks = await Mark.find({ student: req.params.studentId });
    res.json(marks);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.create = async (req, res) => {
  try {
    const mark = new Mark(req.body);
    // calculate total
    mark.total = (mark.theory || 0) + (mark.practical || 0) + (mark.internal || 0);
    await mark.save();
    res.status(201).json(mark);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.update = async (req, res) => {
  try {
    const mark = await Mark.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!mark) return res.status(404).json({ msg: 'Mark not found' });
    mark.total = (mark.theory || 0) + (mark.practical || 0) + (mark.internal || 0);
    await mark.save();
    res.json(mark);
  } catch (err) {
    res.status(500).send('Server error');
  }
};
