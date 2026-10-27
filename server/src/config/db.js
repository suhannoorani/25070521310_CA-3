import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongodInstance = null;

export const connectDB = async () => {
  const targetUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/skillswap';
  
  try {
    // Attempt standard connection to MongoDB Community Server first (5 second timeout)
    console.log(`[Database] Attempting connection to MongoDB at: ${targetUri}...`);
    await mongoose.connect(targetUri, {
      serverSelectionTimeoutMS: 3000,
      connectTimeoutMS: 5000,
    });
    console.log(`[Database]  Connected to MongoDB Community Server at ${targetUri}`);
    console.log(`[Database]  Compass Connection String: ${targetUri}`);
  } catch (err) {
    console.warn(`[Database]  Could not connect to MongoDB Community Server at ${targetUri} (${err.message}).`);
    console.log(`[Database]  Falling back to embedded MongoDB Server instance for seamless zero-config operation...`);
    try {
      mongodInstance = await MongoMemoryServer.create();
      const inMemoryUri = mongodInstance.getUri() + 'skillswap';
      await mongoose.connect(inMemoryUri);
      console.log(`[Database]  Embedded MongoDB instance started successfully at: ${inMemoryUri}`);
      console.log(`[Database]  Full CRUD, registration, and swap features are operational!`);
    } catch (memErr) {
      console.error(`[Database]  Critical: Failed to start embedded MongoDB as well:`, memErr);
      throw memErr;
    }
  }
};

export const closeDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongodInstance) {
      await mongodInstance.stop();
    }
  } catch (err) {
    console.error('Error closing database connection:', err);
  }
};
