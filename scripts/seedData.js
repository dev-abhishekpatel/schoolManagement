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
const Notice = require('../models/Notice');

const connectDB = require('../config/db');

async function seedData() {
  try {
    await connectDB();
    console.log('🌱 Connected to MongoDB for Seeding...');

    // Clear existing users, students, teachers, classes
    await User.deleteMany({});
    await Student.deleteMany({});
    await Teacher.deleteMany({});
    await Class.deleteMany({});
    await Fee.deleteMany({});
    await Notice.deleteMany({});

    console.log('🧹 Cleared existing database records.');

    // 1. Create Hashed Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    // 2. Create Users (Admin, Teachers, Students, Parents)
    const adminUser = await User.create({
      name: 'System Admin (Dr. Rajesh Sharma)',
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
      section: 'A',
      roomNumber: '101-A',
      classTeacher: teacherUser1._id,
      subjects: ['Mathematics', 'Science', 'English', 'Computer Science']
    });

    const class10B = await Class.create({
      name: 'Class 10',
      section: 'B',
      roomNumber: '102-B',
      classTeacher: teacherUser2._id,
      subjects: ['Mathematics', 'Science', 'Social Studies', 'Hindi']
    });

    // 4. Create Teacher Profiles
    await Teacher.create({
      userId: teacherUser1._id,
      name: teacherUser1.name,
      email: teacherUser1.email,
      phone: '+91 98765 43210',
      qualification: 'M.Sc. Mathematics, B.Ed.',
      experience: '8 Years',
      subject: 'Mathematics',
      assignedClasses: [class10A._id, class10B._id],
      joiningDate: new Date('2018-06-15'),
      salary: 55000
    });

    await Teacher.create({
      userId: teacherUser2._id,
      name: teacherUser2.name,
      email: teacherUser2.email,
      phone: '+91 98765 43211',
      qualification: 'M.Sc. Physics, Ph.D.',
      experience: '10 Years',
      subject: 'Science',
      assignedClasses: [class10A._id],
      joiningDate: new Date('2016-04-10'),
      salary: 62000
    });

    // 5. Create Student Profiles
    await Student.create({
      userId: studentUser1._id,
      name: studentUser1.name,
      email: studentUser1.email,
      admissionNo: 'ADM-2024-001',
      rollNo: '1001',
      classId: class10A._id,
      className: 'Class 10',
      section: 'A',
      gender: 'Male',
      dob: new Date('2009-05-14'),
      parentName: parentUser.name,
      parentEmail: parentUser.email,
      parentPhone: '+91 91234 56789',
      address: '42, Green Park Avenue, New Delhi',
      attendancePercentage: 94.5
    });

    await Student.create({
      userId: studentUser2._id,
      name: studentUser2.name,
      email: studentUser2.email,
      admissionNo: 'ADM-2024-002',
      rollNo: '1002',
      classId: class10A._id,
      className: 'Class 10',
      section: 'A',
      gender: 'Female',
      dob: new Date('2009-08-22'),
      parentName: 'Ramesh Sharma',
      parentEmail: 'ramesh@gmail.com',
      parentPhone: '+91 98111 22334',
      address: '15, Lotus Towers, Saket, New Delhi',
      attendancePercentage: 91.2
    });

    // 6. Create Notices
    await Notice.create({
      title: 'Annual Mid-Term Examination Schedule Released',
      content: 'The Mid-Term Exams for Class 9 through Class 12 start on September 15th. Please download the timetable.',
      audience: 'ALL',
      publishedBy: 'Principal Office',
      createdAt: new Date()
    });

    await Notice.create({
      title: 'Parent-Teacher Meeting (PTM) Scheduled',
      content: 'First quarterly PTM will be held on Saturday from 9:00 AM to 1:00 PM. Parents are requested to join.',
      audience: 'PARENT',
      publishedBy: 'Academic Cell',
      createdAt: new Date()
    });

    // 7. Create Fee Invoices
    await Fee.create({
      studentId: studentUser1._id,
      studentName: studentUser1.name,
      className: 'Class 10-A',
      amount: 15000,
      feeType: 'Tuition Fee (Q2)',
      dueDate: new Date('2026-09-30'),
      status: 'PAID',
      paidDate: new Date('2026-08-01')
    });

    await Fee.create({
      studentId: studentUser2._id,
      studentName: studentUser2.name,
      className: 'Class 10-A',
      amount: 15000,
      feeType: 'Tuition Fee (Q2)',
      dueDate: new Date('2026-09-30'),
      status: 'PENDING'
    });

    console.log('✅ Demo Seed Data Created Successfully!');
    console.log('----------------------------------------------------');
    console.log('🔑 Demo Credentials:');
    console.log('   Admin:    admin@school.com   / password123');
    console.log('   Teacher:  teacher@school.com / password123');
    console.log('   Student:  student@school.com / password123');
    console.log('   Parent:   parent@school.com  / password123');
    console.log('----------------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error Seeding Data:', error);
    process.exit(1);
  }
}

seedData();
