const Exam = require('../models/Exam');

exports.getAll = async (req, res) => {
  try {
    const exams = await Exam.find().populate('class').sort({ createdAt: -1 });
    res.json(exams);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch exams from MongoDB', error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id).populate('class');
    if (!exam) return res.status(404).json({ msg: 'Exam not found' });
    res.json(exam);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { title, type, subjects, schedule } = req.body;
    const exam = new Exam({
      title: title || 'Term Examination',
      type: type || 'Term',
      subjects: subjects || ['Mathematics', 'Science'],
      schedule: schedule || [
        { subject: 'Mathematics', date: new Date('2026-09-15'), startTime: '09:00 AM', endTime: '12:00 PM', maxMarks: 100, passingMarks: 33 },
        { subject: 'Science', date: new Date('2026-09-17'), startTime: '09:00 AM', endTime: '12:00 PM', maxMarks: 100, passingMarks: 33 }
      ]
    });
    await exam.save();
    const populated = await Exam.findById(exam._id).populate('class');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to save exam to MongoDB', error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const exam = await Exam.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('class');
    if (!exam) return res.status(404).json({ msg: 'Exam not found' });
    res.json(exam);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to update exam in MongoDB', error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const exam = await Exam.findByIdAndDelete(req.params.id);
    if (!exam) return res.status(404).json({ msg: 'Exam not found' });
    res.json({ msg: 'Exam deleted from MongoDB' });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to delete exam from MongoDB', error: err.message });
  }
};
