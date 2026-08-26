const Teacher = require('../models/Teacher');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const dbStore = require('../services/dbStore');

exports.getAll = async (req, res) => {
  try {
    if (dbStore.isMongoConnected()) {
      const teachers = await Teacher.find().populate('assignedClasses user').sort({ createdAt: -1 });
      return res.json(teachers);
    } else {
      const teachers = dbStore.getCollection('teachers');
      return res.json(teachers);
    }
  } catch (err) {
    const teachers = dbStore.getCollection('teachers');
    return res.json(teachers);
  }
};

exports.getById = async (req, res) => {
  try {
    if (dbStore.isMongoConnected()) {
      const teacher = await Teacher.findById(req.params.id).populate('assignedClasses user');
      if (!teacher) return res.status(404).json({ msg: 'Teacher not found' });
      return res.json(teacher);
    } else {
      const teachers = dbStore.getCollection('teachers');
      const teacher = teachers.find(t => String(t._id || t.id) === String(req.params.id));
      if (!teacher) return res.status(404).json({ msg: 'Teacher not found' });
      return res.json(teacher);
    }
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, email, phone, subject, subjects, qualification, experience, salary } = req.body;
    if (dbStore.isMongoConnected()) {
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
      return res.status(201).json(populated);
    } else {
      const newTeacher = dbStore.addItem('teachers', {
        name,
        email: email || '',
        phone: phone || '+91 98765 43210',
        subject: subject || (subjects && subjects[0]) || 'General',
        qualification: qualification || 'M.Sc.',
        experience: experience || '5 Yrs',
        salary: salary ? `₹${Number(salary).toLocaleString('en-IN')}` : '₹55,000',
        classes: 'Class 10-A'
      });
      return res.status(201).json(newTeacher);
    }
  } catch (err) {
    res.status(500).json({ msg: 'Failed to save teacher to Database', error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    if (dbStore.isMongoConnected()) {
      const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('assignedClasses user');
      if (!teacher) return res.status(404).json({ msg: 'Teacher not found' });
      return res.json(teacher);
    } else {
      const updated = dbStore.updateItem('teachers', req.params.id, req.body);
      if (!updated) return res.status(404).json({ msg: 'Teacher not found' });
      return res.json(updated);
    }
  } catch (err) {
    res.status(500).json({ msg: 'Failed to update teacher in Database', error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    if (dbStore.isMongoConnected()) {
      const teacher = await Teacher.findByIdAndDelete(req.params.id);
      if (!teacher) return res.status(404).json({ msg: 'Teacher not found' });
      return res.json({ msg: 'Teacher deleted from Database' });
    } else {
      const deleted = dbStore.deleteItem('teachers', req.params.id);
      if (!deleted) return res.status(404).json({ msg: 'Teacher not found' });
      return res.json({ msg: 'Teacher deleted from Database' });
    }
  } catch (err) {
    res.status(500).json({ msg: 'Failed to delete teacher from Database', error: err.message });
  }
};

