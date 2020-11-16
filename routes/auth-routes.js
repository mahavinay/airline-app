// routes/auth.routes.js

const { Router } = require('express');
const router = new Router();
const passport = require('passport');

// User model
const User = require('../models/User.model');

// Bcrypt to encrypt passwords
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

router.get('/signup', (req, res, next) => res.render('auth/signup'));

router.post('/signup', (req, res, next) => {
  const { username, password, role} = req.body;
  console.log(username, password, role);
  // 1. Check username and password are not empty
  if (!username || !password ) {
    res.render('auth/signup', { errorMessage: 'Indicate username and password' });
    return;
  }

  User.findOne({ username })
    .then(user => {
      // 2. Check user does not already exist
      if (user !== null) {
        res.render('auth/signup', { message: 'The username already exists' });
        return;
      }

      // Encrypt the password
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);
            //
      // Save the user in DB
      //

      const newUser = new User({
        username,
        passwordHash: hashPass,
        role,
      });

      newUser
        .save()
        .then(() => res.redirect("/"))
        .catch(err => next(err));
    })
    .catch(err => next(err));
});

router.get('/login', (req, res, next) => {
  res.render('auth/login', {user: req.user}); 
});

/* router.post('/login',
  passport.authenticate('local', { successRedirect: '/private',
                                   failureRedirect: '/login',
                                   failureFlash: true })
); */

router.post(
  '/login',
  passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
  }), (req, res) => {
    if (req.user.role === "GUEST") {
      res.render("auth/main");
    }
    if (req.user.role === "ADMIN") {
      res.redirect('/private');
    }
    if (req.user.role === "EDITOR") {
      console.log("Maha");
      res.redirect('/private');
    }
  });

/* const checkGuest = checkRoles();
const checkEditor = checkRoles();
const checkAdmin = checkRoles(); */

router.get('/private', checkRoles(), (req, res) => {
  res.render('private', { user: req.user });
});


function checkRoles() {
  return function (req, res, next) {
    console.log("REQ>ROLE",req.user.role);
   
    if (req.isAuthenticated() && (req.user.role === "ADMIN" || req.user.role === "EDITOR" )) {
      return next();
    } else {
      res.redirect('/login');
    }
  };
}

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    // The user is authenticated
    // and we have access to the logged user in req.user
    return next();
  } else {
    res.redirect('/login');
  }
}

router.post("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});


 
router.get('/posts', checkRoles(), (req, res) => {
  res.render('private', { user: req.user });
});

router.post('/rooms', ensureAuthenticated, (req, res, next) => {
  const { name, desc } = req.body;
  const { _id } = req.user; // <-- Id from the logged user
  Room.create({
    name,
    desc,
    owner: _id,
  })
    .then(() => res.redirect('/rooms'))
    .catch((err) => next(err));
});

router.get('/rooms', ensureAuthenticated, (req, res, next) => {
  const { _id } = req.user;
  Room.find({ owner: _id })
    .then((myRooms) => res.render('rooms/index', { rooms: myRooms }))
    .catch((err) => next(err));
});

module.exports = router;
