const mongoose = require('mongoose');
const { UserModel } = require('../model/user.model');
const bcrypt = require('bcrypt');
require('dotenv').config();

const sampleDealer = {
  name: "Premium Auto Sales",
  email: "sales@premiumauto.com",
  password: bcrypt.hashSync("dealer123", 10),
  role: "dealer"
};

async function seedDealer() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');

    // Clear existing dealer if exists
    await UserModel.deleteMany({ email: sampleDealer.email });
    console.log('Cleared existing dealer from users collection');

    // Add sample dealer
    const dealer = await UserModel.create(sampleDealer);
    console.log('Added sample dealer to users collection with ID:', dealer._id);

    console.log('Seeding completed successfully');
    return dealer._id;
  } catch (error) {
    console.error('Error seeding dealer:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Run the seed function
seedDealer();
