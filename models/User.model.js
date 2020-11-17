// models/user.js

const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    username : {
      type: String,
      trim: true,
      required: [true, 'Username is required.'],
      unique: true

    },
    passwordHash : {
      type: String,
      trim: true,
      required: [true, 'Password is required.'],
      },

    Tickets:{
        author: { type: Schema.Types.ObjectId, ref: "Ticket" },
      }
  },
  {
    timestamps: true
  }
);

module.exports = model('User', userSchema);
