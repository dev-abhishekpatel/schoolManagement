const Student = require('../models/Student');
const Class = require('../models/Class');

exports.getAll = async (req, res) => {
  try {
    const students = await Student.find().populate('class parent user').sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch students from MongoDB', error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate('class parent user');
    if (!student) return res.status(404).json({ msg: 'Student not found in MongoDB' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, rollNo, rollNumber, className, gender, parentName, phone, email, address } = req.body;
    let classObj = null;
    if (className) {
      classObj = await Class.findOne({ name: className });
    }

    const rNum = rollNo || rollNumber || String(Math.floor(1000 + Math.random() * 9000));
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
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to save student to MongoDB', error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('class parent user');
    if (!student) return res.status(404).json({ msg: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to update student in MongoDB', error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ msg: 'Student not found' });
    res.json({ msg: 'Student record deleted from MongoDB' });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to delete student from MongoDB', error: err.message });
  }
};
