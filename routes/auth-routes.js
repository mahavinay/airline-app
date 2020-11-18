// routes/auth.routes.js

const { Router } = require('express');
const router = new Router();
const passport = require('passport');

// User model
const User = require('../models/User.model');
const Ticket = require('../models/ticket.model');

// Bcrypt to encrypt passwords
const bcrypt = require('bcrypt');
const ticketModel = require('../models/ticket.model');
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

  
router.get('/private', (req, res) => {
  res.render('private', { user: req.user });
});

router.get('/ticket', (req, res, next) => {
   User.findById()
  .then((dbUsers) => {
  res.render("tickets/create-form", { dbUsers });
})
.catch((err) =>
  console.error(`Err while displaying tickets : ${err}`)
);
});

router.post('/ticket', (req, res, next) => {
const { origin, destination, quantity, date } = req.body;
Ticket.create({ origin, destination, quantity, date, user:req.session.passport.username } )
.then((dbUsers) => {
  res.render("private", { dbUsers });
})
.catch((err) =>
console.error(`Err while creating and updating ticket in the DB: ${err}`)
);
});

router.get('/myTickets', (req, res) => {
   Ticket.find({user: req.session.passport.user})
  .then((dbUsers) => {
    console.log(dbUsers);
    res.render("tickets/myTickets", { tUser: dbUsers});
  })
  .catch((err) =>
    console.error(`Err while displaying tickets in my tickets: ${err}`)
  ); 
});



/* router.get("/private", (req, res) => {
  const { userId } = req.params;
  console.log(userId);
  User.findById(userId)
    .populate("tickets")
    .then((userFromDB) => console.log(userFromDB))
    .catch((err) => `Error while getting user from the DB: ${err}`);
}); */


router.post("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});


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

/* function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    // The user is authenticated
    // and we have access to the logged user in req.user
    return next();
  } else {
    res.redirect('/login');
  }
}
 */

module.exports = router;
