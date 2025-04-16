// Models/Entity.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/mysql');

const Entity = sequelize.define('Entity', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
});

// We'll set up associations after both models are defined
// This is done in a separate file to avoid circular dependencies

module.exports = Entity;