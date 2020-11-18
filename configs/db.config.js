// this line will have to be added to future seed scripts if you want to support reading the connection string from .env
require('dotenv').config();
const mongoose = require("mongoose");

const DB_NAME = "IronAirlines"
if (process.env.MONGO_CONNECTION_STRING === undefined){
  console.log("please set MONGO_CONNECTION_STRING environment variable.")
  
} else {
mongoose.connect(`${process.env.MONGO_CONNECTION_STRING}/${DB_NAME}`, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(x =>
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  )
  .catch(err => console.error('Error connecting to mongo', err));
}