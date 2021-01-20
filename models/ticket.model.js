const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const ticketSchema = new Schema(
    {
      origin: String,
      destination: String,
      quantity: Number,
      date: Date,
      user: { type: Schema.Types.ObjectId, ref: "User" }
    },

  );
  module.exports = model("Ticket", ticketSchema);