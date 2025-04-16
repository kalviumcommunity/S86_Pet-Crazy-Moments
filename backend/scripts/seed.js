// seed.js
const { sequelize } = require('../config/mysql');
const User = require('../Models/User');
const Entity = require('../Models/Entity');
// Import associations to make sure they're set up
require('../Models/associations');

async function seed() {
  await sequelize.sync({ force: true });

  const users = await User.bulkCreate([
    { name: 'bhavdeep', email: 'bhavdeep@gmail.com' },
    { name: 'kalvium', email: 'kalvium@gmail.com' },
    { name: 'apollo', email: 'apollo@gmail.com' },
  ]);

  await Entity.bulkCreate([
    { title: 'Entity 1', description: 'Created by Bhavdeep', created_by: users[0].id },
    { title: 'Entity 2', description: 'Good moring to all', created_by: users[0].id },
    { title: 'Entity 3', description: 'Created by kalvium', created_by: users[1].id },
    { title: 'Entity 4', description: 'Welcome to Kalvium', created_by: users[1].id },
    { title: 'Entity 5', description: 'Created by apollo', created_by: users[2].id },
    { title: 'Entity 6', description: 'Created by apollo', created_by: users[2].id },
    { title: 'Entity 7', description: 'Join to apollo for good placements', created_by: users[2].id },
  ]);

  console.log('Database seeded!');
  process.exit();
}

seed();