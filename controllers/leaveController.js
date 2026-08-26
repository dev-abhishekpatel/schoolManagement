const LeaveRequest = require('../models/LeaveRequest');

exports.getLeaves = async (req, res) => {
  try {
    const leaves = await LeaveRequest.find().populate('applicant').sort({ createdAt: -1 });
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

exports.requestLeave = async (req, res) => {
  try {
    const { from, to, reason, role } = req.body;
    const lr = new LeaveRequest({
      applicant: req.user ? req.user.id : null,
      role: role || (req.user ? req.user.role : 'STUDENT'),
      from: from ? new Date(from) : new Date(),
      to: to ? new Date(to) : new Date(),
      reason: reason || 'Personal Leave',
      status: 'PENDING'
    });
    await lr.save();
    const populated = await LeaveRequest.findById(lr._id).populate('applicant');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to create leave request', error: err.message });
  }
};

exports.review = async (req, res) => {
  try {
    const lr = await LeaveRequest.findById(req.params.id);
    if (!lr) return res.status(404).json({ msg: 'Leave request not found' });
    lr.status = req.body.status || 'APPROVED';
    await lr.save();
    const populated = await LeaveRequest.findById(lr._id).populate('applicant');
    res.json(populated);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};
