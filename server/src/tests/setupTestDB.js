import { MongoMemoryReplSet } from 'mongodb-memory-server';
import mongoose from 'mongoose';

process.env.JWT_ACCESS_SECRET ??= 'test-access-secret';
process.env.JWT_REFRESH_SECRET ??= 'test-refresh-secret';

let mongoServer;

const connect = async () => {
  mongoServer = await MongoMemoryReplSet.create({
    binary: { version: '7.0.14' },
  });
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
};

const closeDatabase = async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
};

const clearDatabase = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
};

export { connect, closeDatabase, clearDatabase };
