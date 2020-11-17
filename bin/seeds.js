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
    origin: "Amsterdam: AMS",
    destination: "Kalamazoo: AZO",
    quantity: 2,
  },
  {
    date: 17 / 12 / 2020,
    origin: "Atlanta: ATL",
    destination: "Beijing: PEK",
    quantity: 1,
  },
  {
    date: 19 / 12 / 2020,
    origin: "Dubai: DXB",
    destination: "Madrid: MAD",
    quantity: 2,
  },
  {
    date: 02 / 01 / 2021,
    origin: "London: LHR",
    destination: "Shanghai PVG",
    quantity: 4,
  },
  {
    date: 17 / 01 / 2021,
    origin: "Chicago: ORD",
    destination: "Los Angeles: LAX",
    quantity: 1,
  },
  {
    date: 22 / 01 / 2021,
    origin: "Queens: JFK",
    destination: "Amsterdam: AMS",
    quantity: 2,
  }
]

Ticket.create(ticket)
  .then((ticketFromDB) => {
    console.log(`Created ${ticketFromDB.length} ticket`);
    mongoose.connection.close();
  })
  .catch((err) =>
    console.log(`An error occurred while getting creating ticket: ${err}`)
  ); 