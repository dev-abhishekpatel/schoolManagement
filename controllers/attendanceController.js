const Attendance = require('../models/Attendance');

exports.mark = async (req, res) => {
  try {
    const { student, class: classId, date, status } = req.body;
    const attDate = date ? new Date(date) : new Date();
    const attendance = new Attendance({ student, class: classId, date: attDate, status, markedBy: req.user.id });
    await attendance.save();
    res.status(201).json(attendance);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ msg: 'Attendance already marked for this student on this date' });
    res.status(500).send('Server error');
  }
};

exports.getByClassDate = async (req, res) => {
  try {
    const { classId, date } = req.query;
    const q = {};
    if (classId) q.class = classId;
    if (date) q.date = new Date(date);
    const list = await Attendance.find(q).populate('student class markedBy');
    res.json(list);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.update = async (req, res) => {
  try {
    const att = await Attendance.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!att) return res.status(404).json({ msg: 'Attendance not found' });
    res.json(att);
  } catch (err) {
    res.status(500).send('Server error');
  }
};
