const Mark = require('../models/Mark');
const dbStore = require('../services/dbStore');

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
    if (dbStore.isMongoConnected()) {
      const marks = await Mark.find().populate('student exam').sort({ createdAt: -1 });
      return res.json(marks);
    } else {
      const marks = dbStore.getCollection('marks');
      return res.json(marks);
    }
  } catch (err) {
    const marks = dbStore.getCollection('marks');
    return res.json(marks);
  }
};

exports.getByStudent = async (req, res) => {
  try {
    if (dbStore.isMongoConnected()) {
      const marks = await Mark.find({ student: req.params.studentId }).populate('student exam');
      return res.json(marks);
    } else {
      const marks = dbStore.getCollection('marks');
      return res.json(marks);
    }
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

    if (dbStore.isMongoConnected()) {
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
      return res.status(201).json(populated);
    } else {
      const mark = dbStore.addItem('marks', {
        student: student || 'usr_student1',
        exam: exam || 'ex_1',
        subject: subject || 'Mathematics',
        theory: t,
        practical: p,
        internal: i,
        total,
        grade
      });
      return res.status(201).json(mark);
    }
  } catch (err) {
    res.status(500).json({ msg: 'Failed to record marks', error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    if (dbStore.isMongoConnected()) {
      const mark = await Mark.findById(req.params.id);
      if (!mark) return res.status(404).json({ msg: 'Mark record not found' });
      
      Object.assign(mark, req.body);
      mark.total = (mark.theory || 0) + (mark.practical || 0) + (mark.internal || 0);
      mark.grade = calculateGrade(mark.total);
      await mark.save();
      
      const populated = await Mark.findById(mark._id).populate('student exam');
      return res.json(populated);
    } else {
      const updated = dbStore.updateItem('marks', req.params.id, req.body);
      if (!updated) return res.status(404).json({ msg: 'Mark record not found' });
      return res.json(updated);
    }
  } catch (err) {
    res.status(500).json({ msg: 'Failed to update marks', error: err.message });
  }
};

