const Exam = require('../models/Exam');
const dbStore = require('../services/dbStore');

exports.getAll = async (req, res) => {
  try {
    if (dbStore.isMongoConnected()) {
      const exams = await Exam.find().populate('class').sort({ createdAt: -1 });
      return res.json(exams);
    } else {
      const exams = dbStore.getCollection('exams');
      return res.json(exams);
    }
  } catch (err) {
    const exams = dbStore.getCollection('exams');
    return res.json(exams);
  }
};

exports.getById = async (req, res) => {
  try {
    if (dbStore.isMongoConnected()) {
      const exam = await Exam.findById(req.params.id).populate('class');
      if (!exam) return res.status(404).json({ msg: 'Exam not found' });
      return res.json(exam);
    } else {
      const exams = dbStore.getCollection('exams');
      const exam = exams.find(e => String(e._id || e.id) === String(req.params.id));
      if (!exam) return res.status(404).json({ msg: 'Exam not found' });
      return res.json(exam);
    }
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { title, type, className, subjects, schedule } = req.body;
    const defaultSchedule = [
      { subject: 'Mathematics', date: new Date('2026-09-15'), startTime: '09:00 AM', endTime: '12:00 PM', maxMarks: 100, passingMarks: 33 },
      { subject: 'Science', date: new Date('2026-09-17'), startTime: '09:00 AM', endTime: '12:00 PM', maxMarks: 100, passingMarks: 33 }
    ];

    if (dbStore.isMongoConnected()) {
      const exam = new Exam({
        title: title || 'Term Examination',
        type: type || 'Term',
        subjects: subjects || ['Mathematics', 'Science'],
        schedule: schedule || defaultSchedule
      });
      await exam.save();
      const populated = await Exam.findById(exam._id).populate('class');
      return res.status(201).json(populated);
    } else {
      const newExam = dbStore.addItem('exams', {
        title: title || 'Term Examination',
        type: type || 'Term',
        className: className || 'Class 10-A',
        subjects: subjects || ['Mathematics', 'Science'],
        schedule: schedule || defaultSchedule
      });
      return res.status(201).json(newExam);
    }
  } catch (err) {
    res.status(500).json({ msg: 'Failed to save exam to Database', error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    if (dbStore.isMongoConnected()) {
      const exam = await Exam.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('class');
      if (!exam) return res.status(404).json({ msg: 'Exam not found' });
      return res.json(exam);
    } else {
      const updated = dbStore.updateItem('exams', req.params.id, req.body);
      if (!updated) return res.status(404).json({ msg: 'Exam not found' });
      return res.json(updated);
    }
  } catch (err) {
    res.status(500).json({ msg: 'Failed to update exam in Database', error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    if (dbStore.isMongoConnected()) {
      const exam = await Exam.findByIdAndDelete(req.params.id);
      if (!exam) return res.status(404).json({ msg: 'Exam not found' });
      return res.json({ msg: 'Exam deleted from Database' });
    } else {
      const deleted = dbStore.deleteItem('exams', req.params.id);
      if (!deleted) return res.status(404).json({ msg: 'Exam not found' });
      return res.json({ msg: 'Exam deleted from Database' });
    }
  } catch (err) {
    res.status(500).json({ msg: 'Failed to delete exam from Database', error: err.message });
  }
};
