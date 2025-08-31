require('dotenv').config({ path: './config.env' });
const mongoose = require('mongoose');
const seedAdditionalData = require('./utils/additionalSeedData');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected successfully');
        
        // Seed additional data
        await seedAdditionalData();
        
        // Disconnect after seeding
        await mongoose.disconnect();
        console.log('Seeding completed and database disconnected');
        
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

connectDB();
