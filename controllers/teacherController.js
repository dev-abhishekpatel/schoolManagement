const Teacher = require('../models/Teacher');
const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.getAll = async (req, res) => {
  try {
    const teachers = await Teacher.find().populate('assignedClasses user').sort({ createdAt: -1 });
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch teachers from MongoDB', error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id).populate('assignedClasses user');
    if (!teacher) return res.status(404).json({ msg: 'Teacher not found' });
    res.json(teacher);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, email, phone, subject, subjects, qualification, experience, salary } = req.body;
    let userObj = null;
    if (email) {
      userObj = await User.findOne({ email });
      if (!userObj) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);
        userObj = await User.create({
          name,
          email,
          password: hashedPassword,
          role: 'TEACHER'
        });
      }
    }

    const teacher = new Teacher({
      user: userObj ? userObj._id : req.body.user,
      name,
      email: email || '',
      phone: phone || '',
      qualification: qualification || 'M.Sc., B.Ed.',
      experience: experience ? Number(experience) : 5,
      subjects: subjects || (subject ? [subject] : ['General']),
      joiningDate: new Date()
    });

    await teacher.save();
    const populated = await Teacher.findById(teacher._id).populate('assignedClasses user');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to save teacher to MongoDB', error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('assignedClasses user');
    if (!teacher) return res.status(404).json({ msg: 'Teacher not found' });
    res.json(teacher);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to update teacher in MongoDB', error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndDelete(req.params.id);
    if (!teacher) return res.status(404).json({ msg: 'Teacher not found' });
    res.json({ msg: 'Teacher deleted from MongoDB' });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to delete teacher from MongoDB', error: err.message });
  }
};
