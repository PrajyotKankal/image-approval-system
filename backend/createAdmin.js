// createAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const Admin = require('./models/adminCredentials');

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  const username = 'prajyotkankal12@gmail.com';
  const plainPassword = 'Prajyot'; // 👈 You can change this password

  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const existingAdmin = await Admin.findOne({ username });
  if (existingAdmin) {
    console.log('Admin already exists');
  } else {
    const newAdmin = new Admin({
      username,
      password: hashedPassword,
    });

    await newAdmin.save();
    console.log('New admin created successfully!');
  }

  mongoose.disconnect();
})
.catch(err => {
  console.error('MongoDB connection error:', err);
});
