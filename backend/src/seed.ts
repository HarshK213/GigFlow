import mongoose from 'mongoose';
import { env } from './config/env';
import { Lead } from './models/Lead';
import { User } from './models/User';

async function seed() {
  await mongoose.connect(env.MONGODB_URI);
  console.log('Connected to MongoDB');

  const admin = await User.findOne({ role: 'Admin' });
  if (!admin) {
    console.log('No admin user found. Create one first via Register.');
    process.exit(1);
  }

  const existing = await Lead.countDocuments({ createdBy: admin._id });
  if (existing >= 20) {
    console.log(`${existing} leads already exist for admin — skipping seed.`);
    await mongoose.disconnect();
    return;
  }

  const leads = [
    { name: 'Alice Johnson', email: 'alice@example.com', status: 'New', source: 'Website' },
    { name: 'Bob Smith', email: 'bob@example.com', status: 'Contacted', source: 'Instagram' },
    { name: 'Carol Williams', email: 'carol@example.com', status: 'Qualified', source: 'Referral' },
    { name: 'David Brown', email: 'david@example.com', status: 'New', source: 'Website' },
    { name: 'Eve Davis', email: 'eve@example.com', status: 'Lost', source: 'Instagram' },
    { name: 'Frank Miller', email: 'frank@example.com', status: 'Contacted', source: 'Referral' },
    { name: 'Grace Wilson', email: 'grace@example.com', status: 'New', source: 'Website' },
    { name: 'Henry Moore', email: 'henry@example.com', status: 'Qualified', source: 'Instagram' },
    { name: 'Ivy Taylor', email: 'ivy@example.com', status: 'Contacted', source: 'Referral' },
    { name: 'Jack Anderson', email: 'jack@example.com', status: 'New', source: 'Website' },
    { name: 'Karen Thomas', email: 'karen@example.com', status: 'Lost', source: 'Instagram' },
    { name: 'Leo Jackson', email: 'leo@example.com', status: 'Qualified', source: 'Referral' },
    { name: 'Mia White', email: 'mia@example.com', status: 'New', source: 'Website' },
    { name: 'Noah Harris', email: 'noah@example.com', status: 'Contacted', source: 'Instagram' },
    { name: 'Olivia Martin', email: 'olivia@example.com', status: 'Qualified', source: 'Referral' },
    { name: 'Paul Garcia', email: 'paul@example.com', status: 'New', source: 'Website' },
    { name: 'Quinn Martinez', email: 'quinn@example.com', status: 'Lost', source: 'Instagram' },
    { name: 'Rachel Robinson', email: 'rachel@example.com', status: 'Contacted', source: 'Referral' },
    { name: 'Sam Clark', email: 'sam@example.com', status: 'New', source: 'Website' },
    { name: 'Tina Rodriguez', email: 'tina@example.com', status: 'Qualified', source: 'Instagram' },
    { name: 'Uma Lewis', email: 'uma@example.com', status: 'Contacted', source: 'Website' },
    { name: 'Victor Lee', email: 'victor@example.com', status: 'New', source: 'Referral' },
    { name: 'Wendy Walker', email: 'wendy@example.com', status: 'Qualified', source: 'Instagram' },
    { name: 'Xander Hall', email: 'xander@example.com', status: 'Lost', source: 'Website' },
    { name: 'Yara Allen', email: 'yara@example.com', status: 'New', source: 'Referral' },
  ];

  const leadDocs = leads.map((l) => ({
    ...l,
    createdBy: admin._id,
  }));

  await Lead.insertMany(leadDocs);
  console.log(`${leads.length} leads seeded successfully`);

  await mongoose.disconnect();
  console.log('Disconnected from MongoDB');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
