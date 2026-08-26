const Timetable = require('../models/Timetable');
const dbStore = require('../services/dbStore');

exports.getAll = async (req, res) => {
  try {
    if (dbStore.isMongoConnected()) {
      const list = await Timetable.find().populate('class slots.teacher').sort({ createdAt: -1 });
      return res.json(list);
    } else {
      const list = dbStore.getCollection('timetables');
      return res.json(list);
    }
  } catch (err) {
    const list = dbStore.getCollection('timetables');
    return res.json(list);
  }
};

exports.create = async (req, res) => {
  try {
    const { class: classId, academicYear, slots } = req.body;
    if (dbStore.isMongoConnected()) {
      let tt = null;
      if (classId) {
        tt = await Timetable.findOneAndUpdate(
          { class: classId },
          { academicYear: academicYear || '2025-2026', slots: slots || [] },
          { new: true, upsert: true }
        ).populate('class slots.teacher');
      } else {
        tt = new Timetable(req.body);
        await tt.save();
        tt = await Timetable.findById(tt._id).populate('class slots.teacher');
      }
      return res.status(201).json(tt);
    } else {
      const newTt = dbStore.addItem('timetables', req.body);
      return res.status(201).json(newTt);
    }
  } catch (err) {
    res.status(500).json({ msg: 'Failed to create timetable', error: err.message });
  }
};

exports.getByClass = async (req, res) => {
  try {
    if (dbStore.isMongoConnected()) {
      const query = {};
      if (req.query.classId) query.class = req.query.classId;
      const tt = await Timetable.find(query).populate('class slots.teacher');
      return res.json(tt);
    } else {
      const list = dbStore.getCollection('timetables');
      return res.json(list);
    }
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

