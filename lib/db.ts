import { MongoClient, Db } from 'mongodb';
import { logger } from './logger';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sk_sweets';
const DB_NAME = process.env.DB_NAME || 'sk_sweets';

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function getDb(): Promise<Db> {
  // Return cached connection if already initialized
  if (cachedClient && cachedDb) {
    return cachedDb;
  }

  try {
    const client = new MongoClient(MONGODB_URI, {
      maxPoolSize: 10,
      minPoolSize: 2,
    });

    await client.connect();
    logger.info('Connected to MongoDB');

    cachedClient = client;
    cachedDb = client.db(DB_NAME);

    return cachedDb;
  } catch (error) {
    logger.error('Failed to connect to MongoDB', error);
    throw new Error('Database connection failed');
  }
}

export async function closeDb(): Promise<void> {
  if (cachedClient) {
    await cachedClient.close();
    cachedClient = null;
    cachedDb = null;
    logger.info('Disconnected from MongoDB');
  }
}
