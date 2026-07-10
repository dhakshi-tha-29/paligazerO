require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const connectDB = require('../config/database');
const User = require('../models/User');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const PlagiarismReport = require('../models/PlagiarismReport');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Certificate = require('../models/Certificate');

const seed = async () => {
  await connectDB();

  await User.deleteMany({});
  await Assignment.deleteMany({});
  await Submission.deleteMany({});
  await PlagiarismReport.deleteMany({});
  await Course.deleteMany({});
  await Enrollment.deleteMany({});
  await Certificate.deleteMany({});

  const admin = await User.create({ email: 'admin@paligazer.com', password: 'admin123', first_name: 'Admin', last_name: 'User', role: 'admin', is_verified: true });
  const faculty = await User.create({ email: 'faculty@paligazer.com', password: 'faculty123', first_name: 'Dr. Sarah', last_name: 'Johnson', role: 'faculty', department: 'Computer Science', institution: 'Tech University', is_verified: true });
  const student = await User.create({ email: 'student@paligazer.com', password: 'student123', first_name: 'John', last_name: 'Doe', role: 'student', department: 'Computer Science', institution: 'Tech University', is_verified: true });
  const student2 = await User.create({ email: 'jane@paligazer.com', password: 'jane123', first_name: 'Jane', last_name: 'Smith', role: 'student', department: 'Computer Science', institution: 'Tech University', is_verified: true });
  const student3 = await User.create({ email: 'bob@paligazer.com', password: 'bob123', first_name: 'Bob', last_name: 'Wilson', role: 'student', department: 'Computer Science', institution: 'Tech University', is_verified: true });

  const assignment1 = await Assignment.create({ title: 'Research Paper on AI Ethics', description: 'Write a 2000-word research paper discussing the ethical implications of artificial intelligence in modern society.', faculty_id: faculty._id, course_code: 'CS401', course_name: 'AI Ethics', max_similarity_score: 20, due_date: new Date('2026-08-01') });
  const assignment2 = await Assignment.create({ title: 'Data Structures Implementation', description: 'Implement a binary search tree and AVL tree with insertion, deletion, and traversal operations.', faculty_id: faculty._id, course_code: 'CS201', course_name: 'Data Structures', max_similarity_score: 15, due_date: new Date('2026-07-25') });

  const sub1 = await Submission.create({
    assignment_id: assignment1._id,
    student_id: student._id,
    content: 'Artificial intelligence has transformed modern society in profound ways. The ethical implications of AI systems are far-reaching and complex. Machine learning algorithms now make decisions about hiring, lending, and criminal justice. These systems can perpetuate existing biases and discrimination. We must establish robust ethical frameworks to guide AI development. Privacy concerns arise as AI systems collect and analyze vast amounts of personal data. The potential for autonomous weapons raises serious moral questions about the future of warfare.',
    word_count: 68,
    status: 'submitted'
  });

  const sub2 = await Submission.create({
    assignment_id: assignment1._id,
    student_id: student2._id,
    content: 'The ethical implications of artificial intelligence in modern society deserve careful consideration. AI systems are increasingly making decisions that affect human lives. Machine learning algorithms can perpetuate biases present in training data. Privacy concerns arise as AI systems collect vast amounts of personal information. We need comprehensive ethical frameworks to guide responsible AI development. The potential for misuse of AI technology requires proactive regulation and oversight.',
    word_count: 55,
    status: 'submitted'
  });

  const sub3 = await Submission.create({
    assignment_id: assignment2._id,
    student_id: student3._id,
    content: 'A binary search tree is a data structure that maintains sorted order of elements. Each node has at most two children, with left child less than parent and right child greater. Insertion and deletion operations preserve the binary search tree property. Traversal can be performed in-order, pre-order, or post-order. AVL trees are self-balancing binary search trees where the difference between heights of left and right subtrees is at most one. Rotations maintain balance after insertions and deletions.',
    word_count: 67,
    status: 'submitted'
  });

  const report1 = await PlagiarismReport.create({
    submission_id: sub1._id,
    overall_similarity: 42.3,
    originality_score: 57.7,
    ai_generated_score: 35.0,
    is_ai_generated: false,
    exact_match_percentage: 28.5,
    semantic_match_percentage: 10.8,
    paraphrase_percentage: 3.0,
    matched_sources: [{ submission_id: sub2._id, similarity: 42.3, matching_text: 'ethical implications of artificial intelligence in modern society | machine learning algorithms' }],
    highlighted_content: { original: sub1.content, highlighted: sub1.content.replace(/ethical implications of artificial intelligence in modern society/gi, '<mark>$&</mark>') },
    grammar_errors: [{ line: 3, message: 'Sentence may not start with a capital letter' }]
  });

  const report2 = await PlagiarismReport.create({
    submission_id: sub2._id,
    overall_similarity: 38.1,
    originality_score: 61.9,
    ai_generated_score: 22.0,
    is_ai_generated: false,
    exact_match_percentage: 24.0,
    semantic_match_percentage: 11.1,
    paraphrase_percentage: 3.0,
    matched_sources: [{ submission_id: sub1._id, similarity: 38.1, matching_text: 'ethical implications of artificial intelligence | privacy concerns arise as AI systems' }],
    highlighted_content: { original: sub2.content, highlighted: sub2.content.replace(/ethical implications of artificial intelligence/gi, '<mark>$&</mark>') },
    grammar_errors: []
  });

  const report3 = await PlagiarismReport.create({
    submission_id: sub3._id,
    overall_similarity: 5.2,
    originality_score: 94.8,
    ai_generated_score: 15.0,
    is_ai_generated: false,
    exact_match_percentage: 3.0,
    semantic_match_percentage: 1.2,
    paraphrase_percentage: 1.0,
    matched_sources: [],
    highlighted_content: { original: sub3.content, highlighted: sub3.content },
    grammar_errors: []
  });

  // Courses
  const course1 = await Course.create({
    title: 'Introduction to Artificial Intelligence',
    description: 'Learn the fundamentals of AI including machine learning, neural networks, and natural language processing. Hands-on projects with Python.',
    instructor: faculty._id,
    department: 'Computer Science',
    course_code: 'CS401',
    credits: 4,
    duration_weeks: 14,
    level: 'intermediate',
    category: 'Computer Science',
    max_students: 40,
    enrolled_count: 3,
    status: 'active',
    syllabus: ['Week 1-2: AI History & Overview', 'Week 3-5: Machine Learning Basics', 'Week 6-8: Neural Networks', 'Week 9-11: NLP', 'Week 12-14: Projects'],
    tags: ['AI', 'Machine Learning', 'Python']
  });

  const course2 = await Course.create({
    title: 'Data Structures & Algorithms',
    description: 'Master essential data structures and algorithms. Covers arrays, trees, graphs, sorting, and searching with real-world applications.',
    instructor: faculty._id,
    department: 'Computer Science',
    course_code: 'CS201',
    credits: 3,
    duration_weeks: 12,
    level: 'beginner',
    category: 'Computer Science',
    max_students: 50,
    enrolled_count: 2,
    status: 'active',
    syllabus: ['Week 1-2: Arrays & Linked Lists', 'Week 3-4: Stacks & Queues', 'Week 5-7: Trees & BST', 'Week 8-9: Graphs', 'Week 10-12: Sorting & Searching'],
    tags: ['Data Structures', 'Algorithms', 'Java']
  });

  const course3 = await Course.create({
    title: 'Web Development Full Stack',
    description: 'Build modern web applications from scratch. HTML, CSS, JavaScript, React, Node.js, MongoDB, and deployment strategies.',
    instructor: faculty._id,
    department: 'Computer Science',
    course_code: 'CS301',
    credits: 4,
    duration_weeks: 16,
    level: 'intermediate',
    category: 'Web Development',
    max_students: 35,
    enrolled_count: 1,
    status: 'active',
    syllabus: ['Week 1-3: HTML/CSS/JS', 'Week 4-6: React', 'Week 7-9: Node.js & Express', 'Week 10-12: MongoDB', 'Week 13-16: Full Stack Project'],
    tags: ['Web Dev', 'React', 'Node.js']
  });

  const course4 = await Course.create({
    title: 'Cybersecurity Fundamentals',
    description: 'Introduction to cybersecurity principles, threat detection, encryption, network security, and ethical hacking basics.',
    instructor: faculty._id,
    department: 'Computer Science',
    course_code: 'CS501',
    credits: 3,
    duration_weeks: 12,
    level: 'advanced',
    category: 'Cybersecurity',
    max_students: 30,
    enrolled_count: 0,
    status: 'active',
    syllabus: ['Week 1-2: Security Basics', 'Week 3-5: Cryptography', 'Week 6-8: Network Security', 'Week 9-10: Ethical Hacking', 'Week 11-12: Incident Response'],
    tags: ['Security', 'Networking', 'Ethical Hacking']
  });

  const course5 = await Course.create({
    title: 'Database Management Systems',
    description: 'Relational databases, SQL, normalization, indexing, transactions, and introduction to NoSQL databases like MongoDB.',
    instructor: faculty._id,
    department: 'Computer Science',
    course_code: 'CS202',
    credits: 3,
    duration_weeks: 12,
    level: 'beginner',
    category: 'Computer Science',
    max_students: 45,
    enrolled_count: 1,
    status: 'active',
    syllabus: ['Week 1-2: ER Model', 'Week 3-5: SQL', 'Week 6-7: Normalization', 'Week 8-9: Indexing & Transactions', 'Week 10-12: NoSQL'],
    tags: ['SQL', 'MongoDB', 'Database']
  });

  // Enrollments
  await Enrollment.create({ student_id: student._id, course_id: course1._id, status: 'enrolled', progress: 65 });
  await Enrollment.create({ student_id: student._id, course_id: course2._id, status: 'enrolled', progress: 30 });
  await Enrollment.create({ student_id: student._id, course_id: course3._id, status: 'completed', progress: 100, completed_at: new Date('2026-06-15'), grade: 'A' });
  await Enrollment.create({ student_id: student2._id, course_id: course1._id, status: 'enrolled', progress: 45 });
  await Enrollment.create({ student_id: student2._id, course_id: course2._id, status: 'enrolled', progress: 20 });
  await Enrollment.create({ student_id: student3._id, course_id: course3._id, status: 'enrolled', progress: 80 });
  await Enrollment.create({ student_id: student3._id, course_id: course5._id, status: 'enrolled', progress: 55 });

  // Certificates
  await Certificate.create({
    user_id: student._id,
    type: 'course',
    title: 'Web Development Full Stack - Completion',
    description: 'Successfully completed the Web Development Full Stack course with distinction.',
    issued_by: 'Tech University - CS Department',
    issue_date: '2026-06-15',
    status: 'issued',
    skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js'],
    credits: 4,
  });

  await Certificate.create({
    user_id: student._id,
    type: 'workshop',
    title: 'AI Ethics Workshop',
    description: 'Participated in the 3-day AI Ethics and Responsible Computing workshop.',
    issued_by: 'Tech University - AI Research Lab',
    issue_date: '2026-05-20',
    status: 'issued',
    skills: ['AI Ethics', 'Responsible Computing'],
    credits: 1,
  });

  await Certificate.create({
    user_id: student2._id,
    type: 'project',
    title: 'Hackathon 2026 - Runner Up',
    description: 'Second place in the University Annual Hackathon for building an AI-powered study assistant.',
    issued_by: 'Tech University - Student Affairs',
    issue_date: '2026-04-10',
    status: 'issued',
    skills: ['Teamwork', 'AI', 'Problem Solving', 'Presentation'],
    credits: 2,
  });

  console.log('Seed complete!');
  console.log('Login credentials:');
  console.log('  Admin:    admin@paligazer.com / admin123');
  console.log('  Faculty:  faculty@paligazer.com / faculty123');
  console.log('  Student:  student@paligazer.com / student123');
  console.log('  Student2: jane@paligazer.com / jane123');
  console.log('  Student3: bob@paligazer.com / bob123');
  process.exit(0);
};

seed().catch(e => { console.error(e); process.exit(1); });
