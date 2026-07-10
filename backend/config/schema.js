const mongoose = require('mongoose');

const createTables = async () => {
  // Mongoose models auto-create collections when documents are inserted
  // This file is kept for backward compatibility
  console.log('MongoDB models ready - collections will be created on first document insert');
};

module.exports = { createTables };
