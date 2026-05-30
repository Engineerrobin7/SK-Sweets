// Database Indexes Setup Guide
// Run this script or execute commands in MongoDB to create indexes

import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sk_sweets';
const DB_NAME = process.env.DB_NAME || 'sk_sweets';

async function createIndexes() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(DB_NAME);

    // Users Collection Indexes
    const usersCollection = db.collection('users');
    console.log('Creating indexes for users collection...');
    
    await usersCollection.createIndex({ username: 1 }, { unique: true });
    console.log('✓ Created unique index on username');
    
    await usersCollection.createIndex({ email: 1 }, { unique: true });
    console.log('✓ Created unique index on email');
    
    await usersCollection.createIndex({ role: 1 });
    console.log('✓ Created index on role');

    // Menu Items Collection Indexes
    const menuCollection = db.collection('menu_items');
    console.log('\nCreating indexes for menu_items collection...');
    
    await menuCollection.createIndex({ category: 1 });
    console.log('✓ Created index on category');
    
    await menuCollection.createIndex({ name: 'text', hindiName: 'text', description: 'text' });
    console.log('✓ Created text index on name, hindiName, description');
    
    await menuCollection.createIndex({ available: 1 });
    console.log('✓ Created index on available');

    // Orders Collection Indexes
    const ordersCollection = db.collection('orders');
    console.log('\nCreating indexes for orders collection...');
    
    await ordersCollection.createIndex({ userId: 1 });
    console.log('✓ Created index on userId');
    
    await ordersCollection.createIndex({ createdAt: -1 });
    console.log('✓ Created index on createdAt (descending)');
    
    await ordersCollection.createIndex({ status: 1 });
    console.log('✓ Created index on status');
    
    await ordersCollection.createIndex({ userId: 1, createdAt: -1 });
    console.log('✓ Created compound index on userId + createdAt');

    // Bookings Collection Indexes
    const bookingsCollection = db.collection('bookings');
    console.log('\nCreating indexes for bookings collection...');
    
    await bookingsCollection.createIndex({ userId: 1 });
    console.log('✓ Created index on userId');
    
    await bookingsCollection.createIndex({ createdAt: -1 });
    console.log('✓ Created index on createdAt (descending)');
    
    await bookingsCollection.createIndex({ status: 1 });
    console.log('✓ Created index on status');
    
    await bookingsCollection.createIndex({ eventDate: 1 });
    console.log('✓ Created index on eventDate');

    console.log('\n✅ All indexes created successfully!');
    console.log('\nIndexes Summary:');
    console.log('Users: username, email, role');
    console.log('Menu Items: category, text search (name/hindiName/description), available');
    console.log('Orders: userId, createdAt, status, userId+createdAt compound');
    console.log('Bookings: userId, createdAt, status, eventDate');

  } catch (error) {
    console.error('Error creating indexes:', error);
  } finally {
    await client.close();
  }
}

// Run if executed directly
if (require.main === module) {
  createIndexes();
}

export default createIndexes;

/*
MANUAL MongoDB Commands:

// Users Collection
db.users.createIndex({ username: 1 }, { unique: true });
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ role: 1 });

// Menu Items Collection
db.menu_items.createIndex({ category: 1 });
db.menu_items.createIndex({ name: "text", hindiName: "text", description: "text" });
db.menu_items.createIndex({ available: 1 });

// Orders Collection
db.orders.createIndex({ userId: 1 });
db.orders.createIndex({ createdAt: -1 });
db.orders.createIndex({ status: 1 });
db.orders.createIndex({ userId: 1, createdAt: -1 });

// Bookings Collection
db.bookings.createIndex({ userId: 1 });
db.bookings.createIndex({ createdAt: -1 });
db.bookings.createIndex({ status: 1 });
db.bookings.createIndex({ eventDate: 1 });

// View all indexes
db.users.getIndexes();
db.menu_items.getIndexes();
db.orders.getIndexes();
db.bookings.getIndexes();
*/
