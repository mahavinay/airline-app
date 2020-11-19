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
const bcrypt       = require('bcrypt');
const passport     = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash         = require('connect-flash');
const User          = require('./models/User.model');

require("./configs/db.config");

passport.serializeUser((user, cb) => cb(null, user._id));
 
passport.deserializeUser((id, cb) => {
  User.findById(id)
    .then(user => cb(null, user))
    .catch(err => cb(err));
});
 
passport.use(
  new LocalStrategy(
    {
      usernameField: 'username', 
      passwordField: 'passwordHash' 
    },
    (username, passwordHash, done) => {
       User.findOne({ username })
        .then(user => {
          if (!user) {
            return done(null, false, { message: "Incorrect username" } );
          }
 
          if (!bcrypt.compareSync(passwordHash, user.passwordHash)) {
            return done(null, false, { message: "Incorrect password" });
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

app.use(passport.initialize());
app.use(passport.session());



const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);





// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
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
app.locals.title = 'Welcome to Iron Airlines';



const index = require('./routes/index');
app.use('/', index);

const authRouter = require('./routes/auth-routes');
app.use('/', authRouter);

/* const ticketRouter = require('./routes/ticket-routes');
app.use('/', ticketRouter); */
 
module.exports = app;
