const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const { uploadBuffer } = require('../services/cloudinary');

exports.create = async (req, res) => {
  try {
    const files = [];
    if (req.files && req.files.length) {
      for (const f of req.files) {
        const result = await uploadBuffer(f.buffer, 'assignments');
        files.push(result.secure_url);
      }
    }
    const assignment = new Assignment({ ...req.body, attachments: files, createdBy: req.user.id });
    await assignment.save();
    res.status(201).json(assignment);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.getAll = async (req, res) => {
  try {
    const list = await Assignment.find().populate('assignedClass createdBy');
    res.json(list);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.submit = async (req, res) => {
  try {
    const files = [];
    if (req.files && req.files.length) {
      for (const f of req.files) {
        const result = await uploadBuffer(f.buffer, 'submissions');
        files.push(result.secure_url);
      }
    }
    // Resolve student document for the logged-in user (if exists)
    const Student = require('../models/Student');
    let studentId = req.body.student;
    if (!studentId && req.user.role === 'STUDENT') {
      const studentDoc = await Student.findOne({ user: req.user.id });
      if (studentDoc) studentId = studentDoc._id;
    }
    const submission = new Submission({ assignment: req.params.id, student: studentId || req.body.student || req.user.id, files });
    await submission.save();
    res.status(201).json(submission);
  } catch (err) {
    res.status(500).send('Server error');
  }
};
