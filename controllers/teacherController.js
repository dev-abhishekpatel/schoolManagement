const Teacher = require('../models/Teacher');

exports.getAll = async (req, res) => {
  try {
    const teachers = await Teacher.find().populate('assignedClasses');
    res.json(teachers);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.getById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id).populate('assignedClasses');
    if (!teacher) return res.status(404).json({ msg: 'Teacher not found' });
    res.json(teacher);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.create = async (req, res) => {
  try {
    const data = req.body;
    const teacher = new Teacher(data);
    await teacher.save();
    res.status(201).json(teacher);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.update = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!teacher) return res.status(404).json({ msg: 'Teacher not found' });
    res.json(teacher);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.delete = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndDelete(req.params.id);
    if (!teacher) return res.status(404).json({ msg: 'Teacher not found' });
    res.json({ msg: 'Teacher removed' });
  } catch (err) {
    res.status(500).send('Server error');
  }
};
