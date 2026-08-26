const Timetable = require('../models/Timetable');

exports.getAll = async (req, res) => {
  try {
    const list = await Timetable.find().populate('class slots.teacher').sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { class: classId, academicYear, slots } = req.body;
    let tt = null;
    if (classId) {
      tt = await Timetable.findOneAndUpdate(
        { class: classId },
        { academicYear: academicYear || '2025-2026', slots: slots || [] },
        { new: true, upsert: true }
      ).populate('class slots.teacher');
    } else {
      tt = new Timetable(req.body);
      await tt.save();
      tt = await Timetable.findById(tt._id).populate('class slots.teacher');
    }
    res.status(201).json(tt);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to create timetable', error: err.message });
  }
};

exports.getByClass = async (req, res) => {
  try {
    const query = {};
    if (req.query.classId) query.class = req.query.classId;
    const tt = await Timetable.find(query).populate('class slots.teacher');
    res.json(tt);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};
