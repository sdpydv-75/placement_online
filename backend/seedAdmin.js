require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
require('dns').setServers(['8.8.8.8', '8.8.4.4']);


const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    const email = 'sdpyadav7081@gmail.com';
    let user = await User.findOne({ email });

    if (user) {
      user.role = 'admin';
      user.password = '12345678';
      await user.save();
      console.log('Updated existing user to admin with password: 12345678');
    } else {
      user = await User.create({
        name: 'Sandip Admin',
        email: email,
        password: '12345678',
        role: 'admin'
      });
      console.log('Created new admin user with password: 12345678');
    }
    
    // Check if stats are working
    const Job = require('./models/Job');
    const Application = require('./models/Application');
    const uCount = await User.countDocuments();
    const jCount = await Job.countDocuments();
    const aCount = await Application.countDocuments();
    
    console.log(`Stats - Users: ${uCount}, Jobs: ${jCount}, Applications: ${aCount}`);

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedAdmin();
