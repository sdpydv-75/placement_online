const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Job = require('./models/Job');
const User = require('./models/User');

dotenv.config();

const seedITJobs = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { family: 4 });
    console.log('MongoDB connected for seeding...');

    // Find any recruiter or create one
    let recruiter = await User.findOne({ role: 'recruiter' });
    if (!recruiter) {
      recruiter = await User.create({
        name: 'ITM Recruiter',
        email: 'recruiter@itm.edu',
        password: 'password123',
        role: 'recruiter'
      });
      console.log('Created dummy recruiter.');
    }

    const itJobs = [
      {
        title: 'Full Stack Software Engineer',
        description: 'Looking for a passionate full stack developer proficient in MERN stack. Must understand React, Node.js, and MongoDB.',
        company: 'TechFlow Solutions',
        location: 'Bangalore',
        skills: ['React', 'Node.js', 'MongoDB', 'Express'],
        type: 'Full-time',
        recruiter: recruiter._id
      },
      {
        title: 'Frontend React Intern',
        description: 'Profile building opportunity for freshers to learn industry-level frontend architecture. Minimum 6 months internship.',
        company: 'Innovate AI',
        location: 'Work from home',
        skills: ['React', 'JavaScript', 'CSS', 'HTML'],
        type: 'Internship',
        recruiter: recruiter._id
      },
      {
        title: 'Backend Systems Engineer',
        description: 'Scale our microservices using Go and Node.js. 1-2 years experience preferred.',
        company: 'DataStream Core',
        location: 'Hyderabad',
        skills: ['Node.js', 'Go', 'Microservices', 'SQL'],
        type: 'Full-time',
        recruiter: recruiter._id
      },
      {
        title: 'Generative AI Developer',
        description: 'Build cutting edge LLM-based solutions for our enterprise clients. Strong Python background required.',
        company: 'NextGen AI',
        location: 'Delhi',
        skills: ['Python', 'AI', 'Machine Learning', 'TensorFlow'],
        type: 'Full-time',
        recruiter: recruiter._id
      },
      {
        title: 'UI/UX Product Designer',
        description: 'Design intuitive interfaces for our flagship SaaS platform. Figma expertise is heavily required.',
        company: 'Creative Studio',
        location: 'Pune',
        skills: ['Figma', 'UI Design', 'Wireframing'],
        type: 'Contract',
        recruiter: recruiter._id
      }
    ];

    await Job.insertMany(itJobs);
    console.log('Successfully seeded 5 New IT field jobs.');
    process.exit();
  } catch (error) {
    console.error('Error seeding jobs:', error);
    process.exit(1);
  }
};

seedITJobs();
