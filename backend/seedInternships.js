const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Fix DNS
require('dns').setServers(['8.8.8.8', '8.8.4.4']);

dotenv.config();

const Internship = require('./models/Internship');

const INTERNSHIPS = [
  { name: 'Python Programming Internship', level: 'Beginner', isNew: false, icon: '🐍', color: '#3b82f6' },
  { name: 'Java Programming Internship', level: 'Intermediate', isNew: false, icon: '☕', color: '#ec4899' },
  { name: 'C Programming Internship', level: 'Beginner', isNew: false, icon: '💻', color: '#8b5cf6' },
  { name: 'C++ Programming Internship', level: 'Intermediate', isNew: false, icon: '⚙️', color: '#10b981' },
  { name: 'Web Development Internship', level: 'Beginner', isNew: false, icon: '🌐', color: '#f97316' },
  { name: 'Frontend Development Internship', level: 'Intermediate', isNew: false, icon: '🎨', color: '#eab308' },
  { name: 'Backend Development Internship', level: 'Intermediate', isNew: false, icon: '🗄️', color: '#3b82f6' },
  { name: 'Full Stack Development Internship', level: 'Advanced', isNew: true, icon: '🚀', color: '#ec4899' },
  { name: 'MERN Stack Internship', level: 'Advanced', isNew: true, icon: '⚛️', color: '#10b981' },
  { name: 'Data Science Internship', level: 'Intermediate', isNew: true, icon: '📊', color: '#8b5cf6' },
  { name: 'Machine Learning Internship', level: 'Advanced', isNew: true, icon: '🤖', color: '#f97316' },
  { name: 'Artificial Intelligence Internship', level: 'Advanced', isNew: true, icon: '🧠', color: '#3b82f6' },
  { name: 'Cyber Security Internship', level: 'Intermediate', isNew: false, icon: '🛡️', color: '#ef4444' },
  { name: 'Cloud Computing Internship', level: 'Intermediate', isNew: false, icon: '☁️', color: '#0ea5e9' },
  { name: 'Android App Development Internship', level: 'Intermediate', isNew: false, icon: '📱', color: '#10b981' },
  { name: 'UI/UX Design Internship', level: 'Beginner', isNew: false, icon: '✨', color: '#ec4899' },
  { name: 'Graphic Design Internship', level: 'Beginner', isNew: false, icon: '🖌️', color: '#f59e0b' },
  { name: 'Digital Marketing Internship', level: 'Beginner', isNew: false, icon: '📈', color: '#3b82f6' },
  { name: 'SQL / Database Internship', level: 'Beginner', isNew: false, icon: '🗃️', color: '#8b5cf6' },
  { name: 'DevOps Internship', level: 'Advanced', isNew: true, icon: '♾️', color: '#14b8a6' },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const existing = await Internship.countDocuments();
    if (existing > 0) {
      console.log(`${existing} internships already exist. Skipping seed.`);
      process.exit(0);
    }
    
    await Internship.insertMany(INTERNSHIPS);
    console.log(`✅ Seeded ${INTERNSHIPS.length} internships successfully!`);
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seed();
