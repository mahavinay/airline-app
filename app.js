require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
const session      = require('express-session');
const MongoStore   = require('connect-mongo')(session);
const flash        = require('connect-flash');
const bcrypt       = require('bcrypt');
const passport     = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User          = require('./models/User.model');



//Passport strategy
passport.serializeUser((user, cb) => cb(null, user._id));
 
passport.deserializeUser((id, cb) => {
  User.findById(id)
    .then(user => cb(null, user))
    .catch(err => cb(err));
});
 
passport.use(
  new LocalStrategy(

    {
      username: 'username', 
      passwordHash: 'password' 
    },
    (username, password, done) => {
      User.findOne({ username })
        .then(user => {
          if (!user) {
            return done(null, false, { message: 'Incorrect username' });
          }
 
          if (!bcrypt.compareSync(password, user.passwordHash)) {
            return done(null, false, { message: 'Incorrect password' });
          }
 
          done(null, user);
        })
        .catch(err => done(err));
    }
  )
);


const app = express();

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    name: "appCookie",
    cookie: { maxAge: 60000 },
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 60 * 60 * 24,
    }),
    resave: false,
    saveUninitialized: true
  })
);

/* app.configure(function() {
  app.use(express.cookieParser('keyboard cat'));
  app.use(express.session({ cookie: { maxAge: 60000 }}));
  //app.use(flash());
}); */

app.use(passport.initialize());
app.use(passport.session());


mongoose
  .connect('mongodb://localhost/localpassport', {useNewUrlParser: true, useUnifiedTopology: true,
  useCreateIndex: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);





// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//manage flash messages.
app.use(flash());

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));



// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';



const index = require('./routes/index');
app.use('/', index);

const router = require('./routes/auth-routes');
app.use('/', router);
 
module.exports = app;
