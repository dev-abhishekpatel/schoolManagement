const ClassModel = require('../models/Class');
const dbStore = require('../services/dbStore');

exports.getAll = async (req, res) => {
  try {
    if (dbStore.isMongoConnected()) {
      const classes = await ClassModel.find().populate('sections.classTeacher').sort({ name: 1 });
      return res.json(classes);
    } else {
      const classes = dbStore.getCollection('classes');
      return res.json(classes);
    }
  } catch (err) {
    const classes = dbStore.getCollection('classes');
    return res.json(classes);
  }
};

exports.getById = async (req, res) => {
  try {
    if (dbStore.isMongoConnected()) {
      const cls = await ClassModel.findById(req.params.id).populate('sections.classTeacher');
      if (!cls) return res.status(404).json({ msg: 'Class not found' });
      return res.json(cls);
    } else {
      const classes = dbStore.getCollection('classes');
      const cls = classes.find(c => String(c._id || c.id) === String(req.params.id));
      if (!cls) return res.status(404).json({ msg: 'Class not found' });
      return res.json(cls);
    }
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

    if (dbStore.isMongoConnected()) {
      const cls = new ClassModel({
        name,
        sections: secArray,
        academicYear: academicYear || '2025-2026'
      });
      await cls.save();
      const populated = await ClassModel.findById(cls._id).populate('sections.classTeacher');
      return res.status(201).json(populated);
    } else {
      const newClass = dbStore.addItem('classes', {
        name,
        section: section || 'A',
        roomNumber: roomNumber || '101-A',
        academicYear: academicYear || '2025-2026',
        sections: secArray
      });
      return res.status(201).json(newClass);
    }
  } catch (err) {
    res.status(500).json({ msg: 'Failed to save class to Database', error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    if (dbStore.isMongoConnected()) {
      const cls = await ClassModel.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('sections.classTeacher');
      if (!cls) return res.status(404).json({ msg: 'Class not found' });
      return res.json(cls);
    } else {
      const updated = dbStore.updateItem('classes', req.params.id, req.body);
      if (!updated) return res.status(404).json({ msg: 'Class not found' });
      return res.json(updated);
    }
  } catch (err) {
    res.status(500).json({ msg: 'Failed to update class in Database', error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    if (dbStore.isMongoConnected()) {
      const cls = await ClassModel.findByIdAndDelete(req.params.id);
      if (!cls) return res.status(404).json({ msg: 'Class not found' });
      return res.json({ msg: 'Class deleted from Database' });
    } else {
      const deleted = dbStore.deleteItem('classes', req.params.id);
      if (!deleted) return res.status(404).json({ msg: 'Class not found' });
      return res.json({ msg: 'Class deleted from Database' });
    }
  } catch (err) {
    res.status(500).json({ msg: 'Failed to delete class from Database', error: err.message });
  }
};

