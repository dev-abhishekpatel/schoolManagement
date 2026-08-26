const Mark = require('../models/Mark');

function calculateGrade(total) {
  if (total >= 90) return 'A+';
  if (total >= 80) return 'A';
  if (total >= 70) return 'B+';
  if (total >= 60) return 'B';
  if (total >= 50) return 'C';
  if (total >= 33) return 'D';
  return 'F';
}

exports.getAll = async (req, res) => {
  try {
    const marks = await Mark.find().populate('student exam').sort({ createdAt: -1 });
    res.json(marks);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

exports.getByStudent = async (req, res) => {
  try {
    const marks = await Mark.find({ student: req.params.studentId }).populate('student exam');
    res.json(marks);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { student, exam, subject, theory, practical, internal } = req.body;
    const t = Number(theory || 0);
    const p = Number(practical || 0);
    const i = Number(internal || 0);
    const total = t + p + i;
    const grade = req.body.grade || calculateGrade(total);

    const mark = new Mark({
      student,
      exam,
      subject,
      theory: t,
      practical: p,
      internal: i,
      total,
      grade
    });
    await mark.save();
    const populated = await Mark.findById(mark._id).populate('student exam');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to record marks', error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const mark = await Mark.findById(req.params.id);
    if (!mark) return res.status(404).json({ msg: 'Mark record not found' });
    
    Object.assign(mark, req.body);
    mark.total = (mark.theory || 0) + (mark.practical || 0) + (mark.internal || 0);
    mark.grade = calculateGrade(mark.total);
    await mark.save();
    
    const populated = await Mark.findById(mark._id).populate('student exam');
    res.json(populated);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to update marks', error: err.message });
  }
};
