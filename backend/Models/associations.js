// Models/associations.js
const User = require('./User');
const Entity = require('./Entity');

// Define relationships
Entity.belongsTo(User, { foreignKey: 'created_by' });
User.hasMany(Entity, { foreignKey: 'created_by' });

module.exports = { User, Entity };