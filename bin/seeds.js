const mongoose = require("mongoose");
const Ticket = require("../models/ticket.model");

mongoose.connect(`mongodb://localhost/${DB_NAME}`, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const tickets = [
  {
    date: 1 / 12 / 2020,
    origin: "Amsterdam",
    destination: "Kalamazoo",
    quantity: 2,
  },
  {
    date: 17 / 12 / 2020,
    origin: "Atlanta",
    destination: "Beijing",
    quantity: 4,
  },
  {
    date: 19 / 12 / 2020,
    origin: "Dubai",
    destination: "Madrid",
    quantity: 1,
  }
]

Ticket.create(ticket)
  .then((dronesFromDB) => {
    console.log(`Created ${dronesFromDB.length} ticket`);
    mongoose.connection.close();
  })
  .catch((err) =>
    console.log(`An error occurred while getting creating ticket: ${err}`)
  ); 