// models/user.js

const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    username: String,
    passwordHash: String,
    role: {
      type: String,
      enum: ['GUEST', 'EDITOR', 'ADMIN'],
      default: 'GUEST',
    },
  },
  
  {
    timestamps: true
  }
);

module.exports = model('User', userSchema);
