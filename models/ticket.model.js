const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const ticketSchema = new Schema(
    {
      origin: String,
      destination: String,
      quantity: Number,
      // date: date,
    },
  );

  module.exports = model("Ticket", ticketSchema);