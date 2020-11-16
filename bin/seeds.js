const mongoose = require("mongoose");
const Ticket = require("../models/ticket.model");

mongoose.connect(`mongodb://localhost/${DB_NAME}`, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

Ticket.create(ticket)
.then((dronesFromDB) => {
    console.log(`Created ${dronesFromDB.length} ticket`);
    mongoose.connection.close();
  })
  .catch((err) =>
    console.log(`An error occurred while getting creating ticket: ${err}`)
  ); 