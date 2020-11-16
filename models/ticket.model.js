const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const ticketSchema = new Schema(
    {
      origin: String,
      destination: String,
      quantity: Number,
    },
  );

  module.exports = model("Ticket", ticketSchema);