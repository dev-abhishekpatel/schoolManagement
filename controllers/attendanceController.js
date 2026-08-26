const Attendance = require('../models/Attendance');

exports.getAll = async (req, res) => {
  try {
    const list = await Attendance.find().populate('student class markedBy').sort({ date: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

exports.mark = async (req, res) => {
  try {
    const { student, class: classId, date, status } = req.body;
    const attDate = date ? new Date(date) : new Date();
    
    // Upsert record
    const att = await Attendance.findOneAndUpdate(
      { student, date: attDate },
      { class: classId, status: status || 'Present', markedBy: req.user ? req.user.id : null },
      { new: true, upsert: true }
    ).populate('student class markedBy');

    res.status(200).json(att);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to mark attendance', error: err.message });
  }
};

exports.bulkMark = async (req, res) => {
  try {
    const { records, date, classId } = req.body; // records: [{ studentId, status }]
    const attDate = date ? new Date(date) : new Date();
    const results = [];

    for (const r of (records || [])) {
      const att = await Attendance.findOneAndUpdate(
        { student: r.studentId, date: attDate },
        { class: classId, status: r.status || 'Present', markedBy: req.user ? req.user.id : null },
        { new: true, upsert: true }
      );
      results.push(att);
    }
    res.json({ msg: 'Bulk attendance recorded successfully', count: results.length });
  } catch (err) {
    res.status(500).json({ msg: 'Bulk attendance failed', error: err.message });
  }
};

exports.getByClassDate = async (req, res) => {
  try {
    const { classId, date } = req.query;
    const q = {};
    if (classId) q.class = classId;
    if (date) {
      const d = new Date(date);
      const startOfDay = new Date(d.setHours(0, 0, 0, 0));
      const endOfDay = new Date(d.setHours(23, 59, 59, 999));
      q.date = { $gte: startOfDay, $lte: endOfDay };
    }
    const list = await Attendance.find(q).populate('student class markedBy').sort({ date: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const att = await Attendance.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('student class markedBy');
    if (!att) return res.status(404).json({ msg: 'Attendance record not found' });
    res.json(att);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};
