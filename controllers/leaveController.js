const LeaveRequest = require('../models/LeaveRequest');

exports.requestLeave = async (req, res) => {
  try {
    const lr = new LeaveRequest({ ...req.body, applicant: req.user.id });
    await lr.save();
    res.status(201).json(lr);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.review = async (req, res) => {
  try {
    const lr = await LeaveRequest.findById(req.params.id);
    if (!lr) return res.status(404).json({ msg: 'Leave request not found' });
    lr.status = req.body.status;
    await lr.save();
    res.json(lr);
  } catch (err) {
    res.status(500).send('Server error');
  }
};
