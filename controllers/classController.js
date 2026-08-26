const ClassModel = require('../models/Class');

exports.getAll = async (req, res) => {
  try {
    const classes = await ClassModel.find().populate('sections.classTeacher').sort({ name: 1 });
    res.json(classes);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const cls = await ClassModel.findById(req.params.id).populate('sections.classTeacher');
    if (!cls) return res.status(404).json({ msg: 'Class not found' });
    res.json(cls);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, section, roomNumber, classTeacher, sections, academicYear } = req.body;
    
    let secArray = sections;
    if (!secArray || secArray.length === 0) {
      secArray = [{ name: section || 'A', classTeacher: classTeacher || null, roomNumber: roomNumber || '101' }];
    }

    const cls = new ClassModel({
      name,
      sections: secArray,
      academicYear: academicYear || '2025-2026'
    });

    await cls.save();
    const populated = await ClassModel.findById(cls._id).populate('sections.classTeacher');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to create class', error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const cls = await ClassModel.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('sections.classTeacher');
    if (!cls) return res.status(404).json({ msg: 'Class not found' });
    res.json(cls);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to update class', error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const cls = await ClassModel.findByIdAndDelete(req.params.id);
    if (!cls) return res.status(404).json({ msg: 'Class not found' });
    res.json({ msg: 'Class removed successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to delete class', error: err.message });
  }
};
