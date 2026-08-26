const Student = require('../models/Student');
const Class = require('../models/Class');
const dbStore = require('../services/dbStore');

exports.getAll = async (req, res) => {
  try {
    if (dbStore.isMongoConnected()) {
      const students = await Student.find().populate('class parent user').sort({ createdAt: -1 });
      return res.json(students);
    } else {
      const students = dbStore.getCollection('students');
      return res.json(students);
    }
  } catch (err) {
    const students = dbStore.getCollection('students');
    return res.json(students);
  }
};

exports.getById = async (req, res) => {
  try {
    if (dbStore.isMongoConnected()) {
      const student = await Student.findById(req.params.id).populate('class parent user');
      if (!student) return res.status(404).json({ msg: 'Student not found in Database' });
      return res.json(student);
    } else {
      const students = dbStore.getCollection('students');
      const student = students.find(s => String(s._id || s.id) === String(req.params.id));
      if (!student) return res.status(404).json({ msg: 'Student not found in Database' });
      return res.json(student);
    }
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, rollNo, rollNumber, className, gender, parentName, phone, email, address } = req.body;
    const rNum = rollNo || rollNumber || String(Math.floor(1000 + Math.random() * 9000));

    if (dbStore.isMongoConnected()) {
      let classObj = null;
      if (className) {
        classObj = await Class.findOne({ name: className });
      }
      const student = new Student({
        name,
        rollNumber: rNum,
        admissionNumber: req.body.admissionNumber || `ADM-2026-${rNum}`,
        gender: gender || 'Male',
        section: req.body.section || 'A',
        contact: { phone: phone || '', email: email || '' },
        address: address || 'New Delhi',
        class: classObj ? classObj._id : req.body.class,
        admissionYear: 2026
      });
      await student.save();
      const populated = await Student.findById(student._id).populate('class parent user');
      return res.status(201).json(populated);
    } else {
      const newStudent = dbStore.addItem('students', {
        name,
        rollNo: rNum,
        rollNumber: rNum,
        admissionNo: `ADM-2026-${rNum}`,
        className: className || 'Class 10-A',
        gender: gender || 'Male',
        parentName: parentName || 'Parent',
        parentPhone: phone || '+91 98765 43210',
        attendancePercentage: 95.0,
        feeStatus: 'PAID'
      });
      return res.status(201).json(newStudent);
    }
  } catch (err) {
    res.status(500).json({ msg: 'Failed to save student to Database', error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    if (dbStore.isMongoConnected()) {
      const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('class parent user');
      if (!student) return res.status(404).json({ msg: 'Student not found' });
      return res.json(student);
    } else {
      const updated = dbStore.updateItem('students', req.params.id, req.body);
      if (!updated) return res.status(404).json({ msg: 'Student not found' });
      return res.json(updated);
    }
  } catch (err) {
    res.status(500).json({ msg: 'Failed to update student in Database', error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    if (dbStore.isMongoConnected()) {
      const student = await Student.findByIdAndDelete(req.params.id);
      if (!student) return res.status(404).json({ msg: 'Student not found' });
      return res.json({ msg: 'Student record deleted from Database' });
    } else {
      const deleted = dbStore.deleteItem('students', req.params.id);
      if (!deleted) return res.status(404).json({ msg: 'Student not found' });
      return res.json({ msg: 'Student record deleted from Database' });
    }
  } catch (err) {
    res.status(500).json({ msg: 'Failed to delete student from Database', error: err.message });
  }
};

