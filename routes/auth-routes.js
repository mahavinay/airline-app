
const { Router } = require('express');
const router = new Router();
const passport = require('passport');

const User = require('../models/User.model');
const Ticket = require('../models/ticket.model');

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

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(passwordHash, salt);
    
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

router.get('/tickets', (req, res, next) => {
   User.findById()
  .then((dbUsers) => {
  res.render("tickets/create-form", { dbUsers });
})
.catch((err) =>
  console.error(`Err while displaying tickets : ${err}`)
);
});

router.post('/tickets', (req, res, next) => {
const { origin, destination, quantity, date } = req.body;
Ticket.create({ origin, destination, quantity, date, user:req.session.passport.user} )
.then((dbUsers) => {
  res.render("private", { dbUsers });
})
.catch((err) =>
console.error(`Err while creating and updating ticket in the DB: ${err}`)
);
});

router.get('/myTickets', (req, res) => {
   Ticket.find({user: req.session.passport.user})
  .then((ticketUsers) => {
   res.render("tickets/myTickets", { tUser: ticketUsers});
  })
  .catch((err) =>
    console.error(`Err while displaying tickets in My tickets Page: ${err}`)
  ); 
});

router.get('/tickets/:id/update-form', (req, res) => {
  const { id } = req.params
console.log(id)
  ticketModel.findById(id)
  .then((ticketToEdit) => {
    console.log(ticketToEdit)
    res.render("tickets/update-form", ticketToEdit)
  })
  .catch((error) =>
    console.log(`Error while making edits to ticket: ${error}`))
});

router.post('/tickets/:id/update-form', (req, res) => {
  const { id } = req.params;
  Ticket.findByIdAndUpdate(id)
    .then(() => res.redirect("/myTickets"))
    .catch((error) => console.log('Error while editing ticket: ${error}'));
});

router.post("/myTickets/:id/delete", (req, res) => {
  const { id } = req.params;
  Ticket.findByIdAndDelete(id)
    .then(() => res.redirect("/myTickets"))
    .catch((error) => console.log(`Error while deleting a ticket: ${error}`));
});

router.post("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
