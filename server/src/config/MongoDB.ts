import mongoose from 'mongoose';

const MongoDBconnection = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_URI || '');
    console.log("Connected to MongoDB database!");
  } catch (err) {
    console.error("MongoDB connection failed due to this error :", err);
    process.exit(1);
  }
};

export default MongoDBconnection;