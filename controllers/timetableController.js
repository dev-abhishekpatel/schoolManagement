const Timetable = require('../models/Timetable');

exports.create = async (req, res) => {
  try {
    const tt = new Timetable(req.body);
    await tt.save();
    res.status(201).json(tt);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.getByClass = async (req, res) => {
  try {
    const tt = await Timetable.findOne({ class: req.query.classId }).populate('class');
    res.json(tt);
  } catch (err) {
    res.status(500).send('Server error');
  }
};
