const Attendance = require('../models/Attendance');
const dbStore = require('../services/dbStore');

exports.getAll = async (req, res) => {
  try {
    if (dbStore.isMongoConnected()) {
      const list = await Attendance.find().populate('student class markedBy').sort({ date: -1 });
      return res.json(list);
    } else {
      const list = dbStore.getCollection('attendance');
      return res.json(list);
    }
  } catch (err) {
    const list = dbStore.getCollection('attendance');
    return res.json(list);
  }
};

exports.mark = async (req, res) => {
  try {
    const { student, studentName, class: classId, date, status } = req.body;
    const attDateStr = date ? new Date(date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

    if (dbStore.isMongoConnected()) {
      const attDate = new Date(attDateStr);
      const att = await Attendance.findOneAndUpdate(
        { student, date: attDate },
        { class: classId, status: status || 'Present', markedBy: req.user ? req.user.id : null },
        { new: true, upsert: true }
      ).populate('student class markedBy');
      return res.status(200).json(att);
    } else {
      const attendanceList = dbStore.getCollection('attendance');
      let existing = attendanceList.find(a => String(a.student) === String(student) && a.date === attDateStr);
      
      if (existing) {
        const updated = dbStore.updateItem('attendance', existing._id || existing.id, {
          status: status || 'Present',
          class: classId || existing.class
        });
        return res.json(updated);
      } else {
        const newAtt = dbStore.addItem('attendance', {
          student: student || 'stu_1',
          studentName: studentName || 'Aarav Kumar',
          class: classId || 'Class 10-A',
          date: attDateStr,
          status: status || 'Present'
        });
        return res.status(201).json(newAtt);
      }
    }
  } catch (err) {
    res.status(500).json({ msg: 'Failed to mark attendance in Database', error: err.message });
  }
};

exports.bulkMark = async (req, res) => {
  try {
    const { records, date, classId } = req.body; // records: [{ studentId, studentName, status }]
    const attDateStr = date ? new Date(date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
    const results = [];

    if (dbStore.isMongoConnected()) {
      const attDate = new Date(attDateStr);
      for (const r of (records || [])) {
        const att = await Attendance.findOneAndUpdate(
          { student: r.studentId, date: attDate },
          { class: classId, status: r.status || 'Present', markedBy: req.user ? req.user.id : null },
          { new: true, upsert: true }
        );
        results.push(att);
      }
      return res.json({ msg: 'Bulk attendance recorded successfully', count: results.length });
    } else {
      const attendanceList = dbStore.getCollection('attendance');
      for (const r of (records || [])) {
        let existing = attendanceList.find(a => String(a.student) === String(r.studentId) && a.date === attDateStr);
        if (existing) {
          const updated = dbStore.updateItem('attendance', existing._id || existing.id, {
            status: r.status || 'Present',
            class: classId || existing.class
          });
          results.push(updated);
        } else {
          const newAtt = dbStore.addItem('attendance', {
            student: r.studentId,
            studentName: r.studentName || 'Student Record',
            class: classId || 'Class 10-A',
            date: attDateStr,
            status: r.status || 'Present'
          });
          results.push(newAtt);
        }
      }
      return res.json({ msg: 'Bulk attendance recorded in Database successfully', count: results.length });
    }
  } catch (err) {
    res.status(500).json({ msg: 'Bulk attendance failed', error: err.message });
  }
};

exports.getByClassDate = async (req, res) => {
  try {
    const { classId, date } = req.query;

    if (dbStore.isMongoConnected()) {
      const q = {};
      if (classId) q.class = classId;
      if (date) {
        const d = new Date(date);
        const startOfDay = new Date(d.setHours(0, 0, 0, 0));
        const endOfDay = new Date(d.setHours(23, 59, 59, 999));
        q.date = { $gte: startOfDay, $lte: endOfDay };
      }
      const list = await Attendance.find(q).populate('student class markedBy').sort({ date: -1 });
      return res.json(list);
    } else {
      let list = dbStore.getCollection('attendance');
      if (classId) {
        list = list.filter(a => String(a.class).toLowerCase() === String(classId).toLowerCase());
      }
      if (date) {
        const targetDate = new Date(date).toISOString().split('T')[0];
        list = list.filter(a => a.date === targetDate);
      }
      return res.json(list);
    }
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    if (dbStore.isMongoConnected()) {
      const att = await Attendance.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('student class markedBy');
      if (!att) return res.status(404).json({ msg: 'Attendance record not found' });
      return res.json(att);
    } else {
      const updated = dbStore.updateItem('attendance', req.params.id, req.body);
      if (!updated) return res.status(404).json({ msg: 'Attendance record not found' });
      return res.json(updated);
    }
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};
