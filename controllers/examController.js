const Exam = require('../models/Exam');

exports.getAll = async (req, res) => {
  try {
    const exams = await Exam.find().populate('class');
    res.json(exams);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.getById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id).populate('class');
    if (!exam) return res.status(404).json({ msg: 'Exam not found' });
    res.json(exam);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.create = async (req, res) => {
  try {
    const exam = new Exam(req.body);
    await exam.save();
    res.status(201).json(exam);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.update = async (req, res) => {
  try {
    const exam = await Exam.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!exam) return res.status(404).json({ msg: 'Exam not found' });
    res.json(exam);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.delete = async (req, res) => {
  try {
    const exam = await Exam.findByIdAndDelete(req.params.id);
    if (!exam) return res.status(404).json({ msg: 'Exam not found' });
    res.json({ msg: 'Exam removed' });
  } catch (err) {
    res.status(500).send('Server error');
  }
};
