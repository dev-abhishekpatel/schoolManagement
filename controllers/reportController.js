const Student = require('../models/Student');
const Attendance = require('../models/Attendance');

exports.studentReport = async (req, res) => {
  try {
    const students = await Student.find();
    res.json({ totalStudents: students.length });
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.attendanceSummary = async (req, res) => {
  try {
    const { classId } = req.query;
    const match = classId ? { class: classId } : {};
    const total = await Attendance.countDocuments(match);
    res.json({ totalMarked: total });
  } catch (err) {
    res.status(500).send('Server error');
  }
};
