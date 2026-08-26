const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

const DB_FILE = path.join(__dirname, '../db_store.json');

const dbData = {
  users: [],
  students: [],
  teachers: [],
  classes: [],
  fees: [],
  payments: [],
  notices: [],
  exams: [],
  marks: [],
  assignments: [],
  submissions: [],
  timetables: [],
  books: [],
  buses: [],
  routes: [],
  leaveRequests: [],
  notifications: []
};

async function initLocalDb() {
  if (fs.existsSync(DB_FILE)) {
    try {
      const content = fs.readFileSync(DB_FILE, 'utf8').trim();
      if (content) {
        const parsed = JSON.parse(content);
        if (parsed && Array.isArray(parsed.users) && parsed.users.length > 0) {
          Object.assign(dbData, parsed);
          console.log(`⚡ Loaded Persistent Fast Local Database from db_store.json (${dbData.users.length} users, ${dbData.students.length} students)`);
          return dbData;
        }
      }
    } catch (e) {
      console.warn('⚠️ Re-seeding db_store.json...');
    }
  }

  // Seed initial dataset with valid hashed passwords
  console.log('🌱 Seeding initial fast local database...');
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('password123', salt);

  const adminId = 'usr_admin';
  const teacher1Id = 'usr_teacher1';
  const teacher2Id = 'usr_teacher2';
  const student1Id = 'usr_student1';
  const student2Id = 'usr_student2';
  const parent1Id = 'usr_parent1';

  dbData.users = [
    { _id: adminId, id: adminId, name: 'Dr. Rajesh Sharma (Admin)', email: 'admin@school.com', password: hashedPassword, role: 'ADMIN', createdAt: new Date() },
    { _id: teacher1Id, id: teacher1Id, name: 'Mr. Rahul Verma', email: 'teacher@school.com', password: hashedPassword, role: 'TEACHER', createdAt: new Date() },
    { _id: teacher2Id, id: teacher2Id, name: 'Mrs. Priya Gupta', email: 'priya@school.com', password: hashedPassword, role: 'TEACHER', createdAt: new Date() },
    { _id: student1Id, id: student1Id, name: 'Aarav Kumar', email: 'student@school.com', password: hashedPassword, role: 'STUDENT', createdAt: new Date() },
    { _id: student2Id, id: student2Id, name: 'Ananya Sharma', email: 'ananya@school.com', password: hashedPassword, role: 'STUDENT', createdAt: new Date() },
    { _id: parent1Id, id: parent1Id, name: 'Mr. Suresh Kumar', email: 'parent@school.com', password: hashedPassword, role: 'PARENT', createdAt: new Date() }
  ];

  dbData.classes = [
    { _id: 'cls_10a', id: 'cls_10a', name: 'Class 10', section: 'A', roomNumber: '101-A', academicYear: '2025-2026', sections: [{ name: 'A', roomNumber: '101-A' }] },
    { _id: 'cls_10b', id: 'cls_10b', name: 'Class 10', section: 'B', roomNumber: '102-B', academicYear: '2025-2026', sections: [{ name: 'B', roomNumber: '102-B' }] }
  ];

  dbData.teachers = [
    { _id: 'tch_1', id: 'tch_1', user: teacher1Id, name: 'Mr. Rahul Verma', email: 'teacher@school.com', phone: '+91 98765 43210', subject: 'Mathematics', qualification: 'M.Sc. Mathematics, B.Ed.', experience: '8 Yrs', salary: '₹55,000', classes: 'Class 10-A, 10-B' },
    { _id: 'tch_2', id: 'tch_2', user: teacher2Id, name: 'Mrs. Priya Gupta', email: 'priya@school.com', phone: '+91 98765 43211', subject: 'Science', qualification: 'M.Sc. Physics, Ph.D.', experience: '10 Yrs', salary: '₹62,000', classes: 'Class 10-A' }
  ];

  dbData.students = [
    { _id: 'stu_1', id: 'stu_1', user: student1Id, name: 'Aarav Kumar', email: 'student@school.com', rollNo: '1001', rollNumber: '1001', admissionNo: 'ADM-2024-001', className: 'Class 10-A', class: 'cls_10a', section: 'A', gender: 'Male', parentName: 'Mr. Suresh Kumar', parentPhone: '+91 91234 56789', attendancePercentage: 94.5, feeStatus: 'PAID' },
    { _id: 'stu_2', id: 'stu_2', user: student2Id, name: 'Ananya Sharma', email: 'ananya@school.com', rollNo: '1002', rollNumber: '1002', admissionNo: 'ADM-2024-002', className: 'Class 10-A', class: 'cls_10a', section: 'A', gender: 'Female', parentName: 'Ramesh Sharma', parentPhone: '+91 98111 22334', attendancePercentage: 91.2, feeStatus: 'PENDING' }
  ];

  dbData.fees = [
    { _id: 'fee_1', id: 'fee_1', title: 'Tuition Fee (Q2 - 2026)', amount: 15000, academicYear: '2025-2026', status: 'PAID', dueDate: '2026-09-30' },
    { _id: 'fee_2', id: 'fee_2', title: 'Annual Sports & Activity Fee', amount: 3500, academicYear: '2025-2026', status: 'PENDING', dueDate: '2026-09-30' }
  ];

  dbData.notices = [
    { _id: 'not_1', id: 'not_1', title: 'Annual Mid-Term Examination Schedule Released', body: 'The Mid-Term Exams start on September 15th.', target: 'ALL', createdAt: new Date() },
    { _id: 'not_2', id: 'not_2', title: 'Parent-Teacher Meeting (PTM) Scheduled', body: 'First quarterly PTM will be held on Saturday from 9:00 AM.', target: 'PARENTS', createdAt: new Date() }
  ];

  dbData.exams = [
    { _id: 'ex_1', id: 'ex_1', title: 'Mid-Term Examination 2026', type: 'Term', subjects: ['Mathematics', 'Science', 'English'], schedule: [{ subject: 'Mathematics', date: '2026-09-15' }] }
  ];

  dbData.books = [
    { _id: 'bk_1', id: 'bk_1', title: 'Higher Algebra & Coordinate Geometry', author: 'Hall & Knight', category: 'Mathematics', copies: 12, available: 12 },
    { _id: 'bk_2', id: 'bk_2', title: 'Concepts of Physics (Vol 1)', author: 'H.C. Verma', category: 'Science', copies: 18, available: 18 }
  ];

  dbData.buses = [
    { _id: 'bus_1', id: 'bus_1', number: 'Bus 04', vehicleNo: 'DL-01-AB-4321', driver: 'Rameshwar Singh (+91 98112 33445)', route: 'North Delhi Express Route' }
  ];

  dbData.leaveRequests = [
    { _id: 'lv_1', id: 'lv_1', applicant: teacher1Id, applicantName: 'Mr. Rahul Verma', role: 'TEACHER', reason: 'Attending National Teachers Symposium.', status: 'APPROVED' },
    { _id: 'lv_2', id: 'lv_2', applicant: student1Id, applicantName: 'Aarav Kumar', role: 'STUDENT', reason: 'Family event and medical checkup.', status: 'PENDING' }
  ];

  saveLocalDb();
  return dbData;
}

function saveLocalDb() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(dbData, null, 2), 'utf8');
  } catch (e) {
    console.error('⚠️ Failed to save local DB:', e.message);
  }
}

module.exports = {
  initLocalDb,
  saveLocalDb,
  db: dbData
};
