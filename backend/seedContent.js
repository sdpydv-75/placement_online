const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
require('dns').setServers(['8.8.8.8', '8.8.4.4']);

// Load env vars
dotenv.config({ path: path.join(__dirname, '.env') });

const connectDB = require('./config/db');
const PlacementDrive = require('./models/PlacementDrive');
const CompanyReview = require('./models/CompanyReview');
const SuccessStory = require('./models/SuccessStory');

const seed = async () => {
  try {
    await connectDB();
    
    await PlacementDrive.deleteMany();
    await CompanyReview.deleteMany();
    await SuccessStory.deleteMany();

    await PlacementDrive.insertMany([
      { company: "Tata Consultancy Services (TCS)", date: "August 15, 2026", roles: "Ninja & Digital Profile", ctc: "₹3.3L - ₹7.0L", status: "Upcoming" },
      { company: "Infosys", date: "September 02, 2026", roles: "System Engineer", ctc: "₹3.6L - ₹5.5L", status: "Open" },
      { company: "Wipro Technologies", date: "September 20, 2026", roles: "Project Engineer", ctc: "₹3.5L", status: "Upcoming" },
      { company: "Tech Mahindra", date: "October 10, 2026", roles: "Associate Software Eng", ctc: "₹4.0L", status: "Upcoming" }
    ]);

    await CompanyReview.insertMany([
      { company: "TCS", rating: "4.2", author: "Alumni Batch '23", review: "Great work-life balance and excellent training period for freshers (ILP). Good starting step." },
      { company: "Amazon", rating: "4.5", author: "SDE-1, Batch '22", review: "Fast-paced environment with a huge learning curve. Salary and perks are definitely industry-leading." },
      { company: "Wipro", rating: "3.9", author: "Project Engineer", review: "Friendly culture. The onboarding was smooth but project allocation can take some time." },
      { company: "Infosys", rating: "4.1", author: "Systems Associate", review: "Mysore campus training is legendary. Great campus, amazing facilities, standard growth path." }
    ]);

    await SuccessStory.insertMany([
      { name: "Rahul Verma", role: "Software Development Engineer", company: "Amazon", package: "44 LPA", img: "👨‍💻" },
      { name: "Sneha Gupta", role: "Data Scientist", company: "Microsoft", package: "42 LPA", img: "👩‍💻" },
      { name: "Aman Singh", role: "Product Manager", company: "Flipkart", package: "25 LPA", img: "👨‍💼" },
      { name: "Priya Sharma", role: "Frontend Developer", company: "Atlassian", package: "38 LPA", img: "👩‍🎨" }
    ]);

    console.log('Seed content successfully added');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
