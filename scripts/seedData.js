const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Class = require('../models/Class');
const Fee = require('../models/Fee');
const Payment = require('../models/Payment');
const Notice = require('../models/Notice');
const Exam = require('../models/Exam');
const Mark = require('../models/Mark');
const Assignment = require('../models/Assignment');
const Timetable = require('../models/Timetable');
const Book = require('../models/Book');
const Bus = require('../models/Bus');
const Route = require('../models/Route');
const LeaveRequest = require('../models/LeaveRequest');
const Notification = require('../models/Notification');

async function seedData(isQuiet = false) {
  try {
    if (!isQuiet) console.log('🌱 Seeding MongoDB Database with Comprehensive School Management Data...');

    // Clear existing records across all collections
    await Promise.all([
      User.deleteMany({}),
      Student.deleteMany({}),
      Teacher.deleteMany({}),
      Class.deleteMany({}),
      Fee.deleteMany({}),
      Payment.deleteMany({}),
      Notice.deleteMany({}),
      Exam.deleteMany({}),
      Mark.deleteMany({}),
      Assignment.deleteMany({}),
      Timetable.deleteMany({}),
      Book.deleteMany({}),
      Bus.deleteMany({}),
      Route.deleteMany({}),
      LeaveRequest.deleteMany({}),
      Notification.deleteMany({})
    ]);

    if (!isQuiet) console.log('🧹 Cleared existing database records.');

    // 1. Password Hashing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    // 2. Create Users
    const adminUser = await User.create({
      name: 'Dr. Rajesh Sharma (Admin)',
      email: 'admin@school.com',
      password: hashedPassword,
      role: 'ADMIN'
    });

    const teacherUser1 = await User.create({
      name: 'Mr. Rahul Verma',
      email: 'teacher@school.com',
      password: hashedPassword,
      role: 'TEACHER'
    });

    const teacherUser2 = await User.create({
      name: 'Mrs. Priya Gupta',
      email: 'priya@school.com',
      password: hashedPassword,
      role: 'TEACHER'
    });

    const parentUser = await User.create({
      name: 'Mr. Suresh Kumar',
      email: 'parent@school.com',
      password: hashedPassword,
      role: 'PARENT'
    });

    const studentUser1 = await User.create({
      name: 'Aarav Kumar',
      email: 'student@school.com',
      password: hashedPassword,
      role: 'STUDENT'
    });

    const studentUser2 = await User.create({
      name: 'Ananya Sharma',
      email: 'ananya@school.com',
      password: hashedPassword,
      role: 'STUDENT'
    });

    // 3. Create Classes
    const class10A = await Class.create({
      name: 'Class 10',
      academicYear: '2025-2026',
      sections: [{ name: 'A', classTeacher: teacherUser1._id, roomNumber: '101-A' }]
    });

    const class10B = await Class.create({
      name: 'Class 10',
      academicYear: '2025-2026',
      sections: [{ name: 'B', classTeacher: teacherUser2._id, roomNumber: '102-B' }]
    });

    // 4. Create Teachers
    const teacher1 = await Teacher.create({
      user: teacherUser1._id,
      name: teacherUser1.name,
      email: teacherUser1.email,
      phone: '+91 98765 43210',
      qualification: 'M.Sc. Mathematics, B.Ed.',
      experience: 8,
      subjects: ['Mathematics', 'Computer Science'],
      assignedClasses: [class10A._id, class10B._id],
      joiningDate: new Date('2018-06-15')
    });

    const teacher2 = await Teacher.create({
      user: teacherUser2._id,
      name: teacherUser2.name,
      email: teacherUser2.email,
      phone: '+91 98765 43211',
      qualification: 'M.Sc. Physics, Ph.D.',
      experience: 10,
      subjects: ['Science', 'Physics'],
      assignedClasses: [class10A._id],
      joiningDate: new Date('2016-04-10')
    });

    // 5. Create Students
    const student1 = await Student.create({
      user: studentUser1._id,
      studentId: 'STU-1001',
      admissionNumber: 'ADM-2024-001',
      rollNumber: '1001',
      name: studentUser1.name,
      gender: 'Male',
      dob: new Date('2009-05-14'),
      class: class10A._id,
      section: 'A',
      parent: parentUser._id,
      contact: { phone: '+91 91234 56789', email: parentUser.email },
      address: '42, Green Park Avenue, New Delhi',
      admissionYear: 2024
    });

    const student2 = await Student.create({
      user: studentUser2._id,
      studentId: 'STU-1002',
      admissionNumber: 'ADM-2024-002',
      rollNumber: '1002',
      name: studentUser2.name,
      gender: 'Female',
      dob: new Date('2009-08-22'),
      class: class10A._id,
      section: 'A',
      parent: parentUser._id,
      contact: { phone: '+91 98111 22334', email: 'ramesh@gmail.com' },
      address: '15, Lotus Towers, Saket, New Delhi',
      admissionYear: 2024
    });

    // 6. Create Notices
    await Notice.create({
      title: 'Annual Mid-Term Examination Schedule Released',
      body: 'The Mid-Term Exams for Class 9 through Class 12 start on September 15th. Please download the detailed timetable.',
      target: 'ALL',
      createdBy: adminUser._id
    });

    await Notice.create({
      title: 'Parent-Teacher Meeting (PTM) Scheduled',
      body: 'First quarterly PTM will be held on Saturday from 9:00 AM to 1:00 PM in the Main Auditorium.',
      target: 'PARENTS',
      createdBy: adminUser._id
    });

    await Notice.create({
      title: 'Faculty Academic Council Briefing',
      body: 'All department heads and teachers are requested to attend the curriculum review meeting in Conference Room B.',
      target: 'TEACHERS',
      createdBy: adminUser._id
    });

    // 7. Create Fees & Payments
    const fee1 = await Fee.create({
      title: 'Tuition Fee (Q2 - 2026)',
      description: 'Second Quarter Tuition & Lab charges',
      amount: 15000,
      class: class10A._id,
      academicYear: '2025-2026'
    });

    await Payment.create({
      student: student1._id,
      fee: fee1._id,
      amount: 15000,
      method: 'UPI / Online',
      reference: 'TXN-984210',
      status: 'Paid',
      paidAt: new Date('2026-08-01')
    });

    await Payment.create({
      student: student2._id,
      fee: fee1._id,
      amount: 15000,
      method: 'Net Banking',
      status: 'Pending'
    });

    // 8. Create Exams & Marks
    const exam1 = await Exam.create({
      title: 'First Term Examination 2026',
      type: 'Term',
      class: class10A._id,
      subjects: ['Mathematics', 'Science', 'English', 'Computer Science'],
      schedule: [
        { subject: 'Mathematics', date: new Date('2026-09-15'), startTime: '09:00 AM', endTime: '12:00 PM', maxMarks: 100, passingMarks: 33 },
        { subject: 'Science', date: new Date('2026-09-17'), startTime: '09:00 AM', endTime: '12:00 PM', maxMarks: 100, passingMarks: 33 }
      ]
    });

    await Mark.create({
      student: student1._id,
      exam: exam1._id,
      subject: 'Mathematics',
      theory: 72,
      practical: 20,
      internal: 8,
      total: 100,
      grade: 'A+'
    });

    await Mark.create({
      student: student1._id,
      exam: exam1._id,
      subject: 'Science',
      theory: 68,
      practical: 18,
      internal: 7,
      total: 93,
      grade: 'A'
    });

    await Mark.create({
      student: student2._id,
      exam: exam1._id,
      subject: 'Mathematics',
      theory: 65,
      practical: 19,
      internal: 8,
      total: 92,
      grade: 'A'
    });

    // 9. Assignments
    await Assignment.create({
      title: 'Quadratic Equations & Polynomials Worksheet',
      description: 'Solve problems 1 to 20 from Chapter 4 exercises in your notebook.',
      assignedClass: class10A._id,
      dueDate: new Date('2026-09-02'),
      createdBy: teacherUser1._id
    });

    await Assignment.create({
      title: 'Physics Lab Report: Ohm’s Law Experiment',
      description: 'Submit circuit diagram and voltage-current data tables.',
      assignedClass: class10A._id,
      dueDate: new Date('2026-09-05'),
      createdBy: teacherUser2._id
    });

    // 10. Timetable
    await Timetable.create({
      class: class10A._id,
      academicYear: '2025-2026',
      slots: [
        { day: 'Monday', start: '08:00 AM', end: '08:45 AM', subject: 'Mathematics', teacher: teacher1._id, room: '101-A' },
        { day: 'Monday', start: '08:45 AM', end: '09:30 AM', subject: 'Science', teacher: teacher2._id, room: 'Lab 2' },
        { day: 'Tuesday', start: '08:00 AM', end: '08:45 AM', subject: 'Computer Science', teacher: teacher1._id, room: 'Comp Lab' },
        { day: 'Wednesday', start: '09:30 AM', end: '10:15 AM', subject: 'Mathematics', teacher: teacher1._id, room: '101-A' }
      ]
    });

    // 11. Library Books
    await Book.create({
      title: 'Higher Algebra & Coordinate Geometry',
      author: 'Hall & Knight',
      category: 'Mathematics',
      isbn: '978-019871234',
      copies: 12
    });

    await Book.create({
      title: 'Concepts of Physics (Vol 1)',
      author: 'H.C. Verma',
      category: 'Science',
      isbn: '978-817709187',
      copies: 18
    });

    await Book.create({
      title: 'Encyclopedia of World History',
      author: 'William L. Langer',
      category: 'History',
      isbn: '978-039565237',
      copies: 8
    });

    // 12. Transport Fleet
    const route1 = await Route.create({
      name: 'North Delhi Express Route',
      stops: [
        { name: 'Model Town Circle', pickupTime: '07:15 AM' },
        { name: 'Civil Lines Station', pickupTime: '07:30 AM' },
        { name: 'School Campus Gate 1', pickupTime: '07:55 AM' }
      ]
    });

    await Bus.create({
      number: 'Bus 04',
      driver: 'Rameshwar Singh (+91 98112 33445)',
      vehicleNo: 'DL-01-AB-4321',
      route: route1._id
    });

    // 13. Leave Requests
    await LeaveRequest.create({
      applicant: teacherUser1._id,
      role: 'TEACHER',
      from: new Date('2026-09-10'),
      to: new Date('2026-09-11'),
      reason: 'Attending National Teachers Symposium Conference.',
      status: 'APPROVED'
    });

    await LeaveRequest.create({
      applicant: studentUser1._id,
      role: 'STUDENT',
      from: new Date('2026-09-04'),
      to: new Date('2026-09-05'),
      reason: 'Family event and medical checkup.',
      status: 'PENDING'
    });

    // 14. Notifications
    await Notification.create({
      title: 'Welcome to School Management Portal',
      message: 'Explore your personalized dashboard to manage academic, fee, and class activities.',
      recipientRole: 'ALL',
      read: false
    });

    if (!isQuiet) {
      console.log('✅ Demo Seed Data Created Successfully!');
      console.log('----------------------------------------------------');
      console.log('🔑 Credentials for instant testing:');
      console.log('   Admin:    admin@school.com   / password123');
      console.log('   Teacher:  teacher@school.com / password123');
      console.log('   Student:  student@school.com / password123');
      console.log('   Parent:   parent@school.com  / password123');
      console.log('----------------------------------------------------');
    }
    return true;
  } catch (error) {
    console.error('❌ Error Seeding Data:', error);
    throw error;
  }
}

if (require.main === module) {
  const connectDB = require('../config/db');
  connectDB().then(async () => {
    await seedData();
    process.exit(0);
  }).catch(err => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = seedData;
