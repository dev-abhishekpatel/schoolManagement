const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const dbStore = require('../services/dbStore');

exports.create = async (req, res) => {
  try {
    const { title, description, assignedClass, className, dueDate } = req.body;
    let files = [];
    if (req.files && req.files.length) {
      files = req.files.map(f => f.originalname || 'document.pdf');
    }

    if (dbStore.isMongoConnected()) {
      const assignment = new Assignment({
        title: title || 'Class Assignment',
        description: description || '',
        attachments: files,
        assignedClass: assignedClass || null,
        dueDate: dueDate ? new Date(dueDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        createdBy: req.user ? req.user.id : null
      });
      await assignment.save();
      const populated = await Assignment.findById(assignment._id).populate('assignedClass createdBy');
      return res.status(201).json(populated);
    } else {
      const newAssignment = dbStore.addItem('assignments', {
        title: title || 'Class Assignment',
        description: description || '',
        attachments: files,
        dueDate: dueDate || '2026-09-02',
        status: 'Pending',
        createdAt: new Date().toISOString()
      });
      return res.status(201).json(newAssignment);
    }
  } catch (err) {
    res.status(500).json({ msg: 'Failed to create assignment', error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    if (dbStore.isMongoConnected()) {
      const list = await Assignment.find().populate('assignedClass createdBy').sort({ createdAt: -1 });
      return res.json(list);
    } else {
      const list = dbStore.getCollection('assignments');
      return res.json(list);
    }
  } catch (err) {
    const list = dbStore.getCollection('assignments');
    return res.json(list);
  }
};

exports.submit = async (req, res) => {
  try {
    const files = req.files ? req.files.map(f => f.originalname) : [];
    if (dbStore.isMongoConnected()) {
      const Student = require('../models/Student');
      let studentId = req.body.student;
      if (!studentId && req.user && req.user.role === 'STUDENT') {
        const studentDoc = await Student.findOne({ user: req.user.id });
        if (studentDoc) studentId = studentDoc._id;
      }
      const submission = new Submission({
        assignment: req.params.id,
        student: studentId || req.user?.id,
        files,
        submissionDate: new Date()
      });
      await submission.save();
      return res.status(201).json(submission);
    } else {
      const submission = dbStore.addItem('submissions', {
        assignment: req.params.id,
        student: req.user?.id || 'usr_student1',
        files,
        submissionDate: new Date().toISOString()
      });
      return res.status(201).json(submission);
    }
  } catch (err) {
    res.status(500).json({ msg: 'Failed to submit assignment', error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    if (dbStore.isMongoConnected()) {
      await Assignment.findByIdAndDelete(req.params.id);
      return res.json({ msg: 'Assignment deleted successfully' });
    } else {
      dbStore.deleteItem('assignments', req.params.id);
      return res.json({ msg: 'Assignment deleted successfully' });
    }
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

