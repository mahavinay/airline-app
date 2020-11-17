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
  const { username, passwordHash} = req.body;
  
    if (!username || !passwordHash ) {
    res.render('auth/signup', { errorMessage: 'All fields are mandatory. Please provide your username and password.' });
    return;
  }

  User.findOne({ username })
    .then(user => {
     
      if (user !== null) {
        res.render('auth/signup', { errorMessage: 'The username already exists' });
        return;
      }

      // Encrypt the password
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(passwordHash, salt);
            //
      // Save the user in DB
      //

      const newUser = new User({
        username,
        passwordHash: hashPass,
      });
      console.log(newUser);
      newUser
        .save()
        .then(() => res.render("signup-message", newUser))
        .catch(err => next(err));
    })
    .catch(err => next(err));
});

router.get('/login', (req, res, next) => {
  res.render('auth/login', {user: req.user, errorMessage: req.flash("error")}); 
});

router.post(
  "/login",
  passport.authenticate("local", {
     successRedirect: "/private", 
    failureRedirect: "/login",
    failureFlash:true,
  })

  );

/* router.post(
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
  }); */

/* const checkGuest = checkRoles();
const checkEditor = checkRoles();
const checkAdmin = checkRoles(); */

router.get('/private', (req, res) => {
  res.render('private', { user: req.user });
});


/* function checkRoles() {
  return function (req, res, next) {
    console.log("REQ>ROLE",req.user.role);
   
    if (req.isAuthenticated() && (req.user.role === "ADMIN" || req.user.role === "EDITOR" )) {
      return next();
    } else {
      res.redirect('/login');
    }
  };
} */

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

module.exports = router;
