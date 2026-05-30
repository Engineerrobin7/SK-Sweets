import { MongoClient } from 'mongodb';
import bcryptjs from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sk_sweets';
const DB_NAME = process.env.DB_NAME || 'sk_sweets';

async function initializeDatabase() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(DB_NAME);

    // Drop existing collections
    const collections = await db.listCollections().toArray();
    for (const collection of collections) {
      await db.collection(collection.name).drop();
    }

    // Create users collection with admin user
    const usersCollection = db.collection('users');
    const adminPassword = await bcryptjs.hash('itzsahil1234', 10);

    await usersCollection.insertMany([
      {
        username: 'itzsahil123',
        email: 'admin@sksweets.com',
        password: adminPassword,
        phone: '+91 98765-43210',
        address: '123 Sweet Mansion, Jaipur, Rajasthan',
        role: 'admin',
        createdAt: new Date(),
      },
      {
        username: 'johndoe',
        email: 'john@example.com',
        password: await bcryptjs.hash('password123', 10),
        phone: '+91 99999-88888',
        address: '456 Dessert Ave, Jaipur, Rajasthan',
        role: 'user',
        createdAt: new Date(),
      },
    ]);

    console.log('✅ Created users successfully');

    // Create menu items collection
    const menuCollection = db.collection('menu_items');

    const menuItems = [
      {
        name: 'Royal Gulab Jamun',
        hindiName: 'शाही गुलाब जामुन',
        description: 'Soft, golden, melt-in-your-mouth milk solid dumplings fried in pure desi ghee and soaked in cardamom-infused saffron sugar syrup.',
        price: 180,
        category: 'Traditional',
        image: 'https://images.unsplash.com/photo-1594142410420-5615d909564d?auto=format&fit=crop&q=80&w=800',
        available: true,
        isFeatured: true,
        rating: 4.9,
        weightOptions: ['250g', '500g', '1kg'],
        createdAt: new Date(),
      },
      {
        name: 'Spongy Rasgulla',
        hindiName: 'रसगुल्ला',
        description: 'Delicate, spongy cottage cheese dumplings cooked in a light, refreshing sugar syrup. A Bengali classic.',
        price: 150,
        category: 'Traditional',
        image: 'https://images.unsplash.com/photo-1626132646545-0d35817d23f7?auto=format&fit=crop&q=80&w=800',
        available: true,
        isFeatured: true,
        rating: 4.8,
        weightOptions: ['500g', '1kg'],
        createdAt: new Date(),
      },
      {
        name: 'Premium Kaju Katli',
        hindiName: 'काजू कतली',
        description: 'Smooth and creamy cashew fudge diamonds, made with the finest grade cashews and pure silver vark.',
        price: 280,
        category: 'Premium',
        image: 'https://images.unsplash.com/photo-1610450508930-58c03e878342?auto=format&fit=crop&q=80&w=800',
        available: true,
        isFeatured: true,
        rating: 5.0,
        weightOptions: ['250g', '500g', '1kg'],
        createdAt: new Date(),
      },
      {
        name: 'Motichoor Laddu',
        hindiName: 'मोतीचूर लड्डू',
        description: 'Fine gram flour pearls deep fried in ghee and tossed with nuts, shaped into perfect sweet spheres.',
        price: 160,
        category: 'Traditional',
        image: 'https://images.unsplash.com/photo-1567184109411-e2862bbbb270?auto=format&fit=crop&q=80&w=800',
        available: true,
        isFeatured: false,
        rating: 4.7,
        weightOptions: ['250g', '500g', '1kg'],
        createdAt: new Date(),
      },
      {
        name: 'Saffron Pista Peda',
        hindiName: 'केसर पिस्ता पेड़ा',
        description: 'Rich milk fudge flavored with Kashmiri Kesar and loaded with crunchy Iranian pistachios.',
        price: 220,
        category: 'Premium',
        image: 'https://images.unsplash.com/photo-1624314138470-5a2f24623f10?auto=format&fit=crop&q=80&w=800',
        available: true,
        isFeatured: false,
        rating: 4.6,
        weightOptions: ['250g', '500g', '1kg'],
        createdAt: new Date(),
      },
      {
        name: 'Crispy Jalebi',
        hindiName: 'जलेबी',
        description: 'Traditional fermented batter spirals, deep fried and dunked in saffron-infused syrup. Best served warm.',
        price: 120,
        category: 'Traditional',
        image: 'https://images.unsplash.com/photo-1605333396915-47ed6b68a00e?auto=format&fit=crop&q=80&w=800',
        available: true,
        isFeatured: false,
        rating: 4.5,
        weightOptions: ['250g', '500g', '1kg'],
        createdAt: new Date(),
      },
      {
        name: 'Assorted Gift Box',
        hindiName: 'उपहार डिब्बा',
        description: 'A curated collection of our best-selling sweets, beautifully packaged for your loved ones.',
        price: 650,
        category: 'Gift Packs',
        image: 'https://images.unsplash.com/photo-1549465220-1d8c9d9c6703?auto=format&fit=crop&q=80&w=800',
        available: true,
        isFeatured: true,
        rating: 4.9,
        weightOptions: ['Mixed Assortment'],
        createdAt: new Date(),
      }
    ];

    await menuCollection.insertMany(menuItems);
    console.log('✅ Created premium menu items with images');

    // Create empty collections
    await db.createCollection('orders');
    await db.createCollection('bookings');

    // Create indexes
    await usersCollection.createIndex({ username: 1 }, { unique: true });
    await usersCollection.createIndex({ email: 1 }, { unique: true });
    await menuCollection.createIndex({ category: 1 });
    await menuCollection.createIndex({ name: 'text', hindiName: 'text', description: 'text' });
    await db.collection('orders').createIndex({ createdAt: -1 });
    await db.collection('bookings').createIndex({ eventDate: 1 });

    console.log('Database initialization complete!');
  } catch (error) {
    console.error('Database initialization error:', error);
  } finally {
    await client.close();
  }
}

initializeDatabase();
