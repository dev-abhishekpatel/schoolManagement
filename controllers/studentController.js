const Student = require('../models/Student');

exports.getAll = async (req, res) => {
  try {
    const students = await Student.find().populate('class parent user');
    res.json(students);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.getById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate('class parent user');
    if (!student) return res.status(404).json({ msg: 'Student not found' });

    // Students can only access their own profile
    if (req.user.role === 'STUDENT' && String(student.user) !== req.user.id)
      return res.status(403).json({ msg: 'Forbidden' });

    res.json(student);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.create = async (req, res) => {
  try {
    const data = req.body;
    const student = new Student(data);
    await student.save();
    res.status(201).json(student);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.update = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!student) return res.status(404).json({ msg: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.delete = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ msg: 'Student not found' });
    res.json({ msg: 'Student removed' });
  } catch (err) {
    res.status(500).send('Server error');
  }
};
