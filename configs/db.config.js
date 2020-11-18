const mongoose = require('mongoose');
const DB_NAME = "IronAirlines"
const MONGO_URI= `mongodb://localhost/${DB_NAME}`


mongoose
  .connect(process.env.MONGO_CONNECTION_STRING || MONGO_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(x =>
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  )
  .catch(err => console.error('Error connecting to mongo', err));