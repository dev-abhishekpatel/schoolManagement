const LeaveRequest = require('../models/LeaveRequest');
const dbStore = require('../services/dbStore');

exports.getLeaves = async (req, res) => {
  try {
    if (dbStore.isMongoConnected()) {
      const leaves = await LeaveRequest.find().populate('applicant').sort({ createdAt: -1 });
      return res.json(leaves);
    } else {
      const leaves = dbStore.getCollection('leaveRequests');
      return res.json(leaves);
    }
  } catch (err) {
    const leaves = dbStore.getCollection('leaveRequests');
    return res.json(leaves);
  }
};

exports.requestLeave = async (req, res) => {
  try {
    const { applicantName, from, to, reason, role } = req.body;
    const applicantRole = role || (req.user ? req.user.role : 'STUDENT');

    if (dbStore.isMongoConnected()) {
      const lr = new LeaveRequest({
        applicant: req.user ? req.user.id : null,
        role: applicantRole,
        from: from ? new Date(from) : new Date(),
        to: to ? new Date(to) : new Date(),
        reason: reason || 'Personal Leave Application',
        status: 'PENDING'
      });
      await lr.save();
      const populated = await LeaveRequest.findById(lr._id).populate('applicant');
      return res.status(201).json(populated);
    } else {
      const applicant = applicantName || (req.user ? req.user.name : 'School Staff / Student');
      const newLeave = dbStore.addItem('leaveRequests', {
        applicant,
        role: applicantRole,
        from: from || new Date().toISOString().split('T')[0],
        to: to || new Date(Date.now() + 86400000).toISOString().split('T')[0],
        reason: reason || 'Personal Leave Application',
        status: 'PENDING',
        createdAt: new Date().toISOString()
      });
      return res.status(201).json(newLeave);
    }
  } catch (err) {
    res.status(500).json({ msg: 'Failed to submit leave request to Database', error: err.message });
  }
};

exports.review = async (req, res) => {
  try {
    const newStatus = req.body.status || 'APPROVED';
    if (dbStore.isMongoConnected()) {
      const lr = await LeaveRequest.findById(req.params.id);
      if (!lr) return res.status(404).json({ msg: 'Leave request not found' });
      lr.status = newStatus;
      await lr.save();
      const populated = await LeaveRequest.findById(lr._id).populate('applicant');
      return res.json(populated);
    } else {
      const updated = dbStore.updateItem('leaveRequests', req.params.id, { status: newStatus });
      if (!updated) return res.status(404).json({ msg: 'Leave request not found in database' });
      return res.json(updated);
    }
  } catch (err) {
    res.status(500).json({ msg: 'Failed to update leave status', error: err.message });
  }
};

exports.deleteLeave = async (req, res) => {
  try {
    if (dbStore.isMongoConnected()) {
      const lr = await LeaveRequest.findByIdAndDelete(req.params.id);
      if (!lr) return res.status(404).json({ msg: 'Leave request not found' });
      return res.json({ msg: 'Leave application deleted from Database' });
    } else {
      const deleted = dbStore.deleteItem('leaveRequests', req.params.id);
      if (!deleted) return res.status(404).json({ msg: 'Leave request not found' });
      return res.json({ msg: 'Leave application deleted from Database' });
    }
  } catch (err) {
    res.status(500).json({ msg: 'Failed to delete leave application', error: err.message });
  }
};
