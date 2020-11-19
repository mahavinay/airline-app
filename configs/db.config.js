// this line will have to be added to future seed scripts if you want to support reading the connection string from .env
require('dotenv').config();
const mongoose = require("mongoose");
DB_NAME="IronAirlines"
MONGO_URI=`mongodb://localhost/${DB_NAME}`

mongoose
// .connect(MONGO_URI, {
 .connect(process.env.MONGO_CONNECTION_STRING || MONGO_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(x =>
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  )
  .catch(err => console.error('Error connecting to mongo', err));
