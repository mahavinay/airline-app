
const { Router } = require('express');
const router = new Router();
const passport = require('passport');

const User = require('../models/User.model');
const Ticket = require('../models/ticket.model');

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

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(passwordHash, salt);
    
      const newUser = new User({
        username,
        passwordHash: hashPass,
      });
      
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

/*  router.get("/myTickets/:id/update-form", (req, res) => {
  const { id } = req.params;
     Ticket.findById(id)
    .then((ticketFromDB) => res.render("tickets/update-form", {ticketFromDB} ))
    .catch((error) => console.log(`Error while updating a ticket: ${error}`));
})  */



router.get("/myTickets/:id/update-form", (req, res) => {
  const { id } = req.params;
     Ticket.findById(id)
     .then((ticketFromDB) => res.render("tickets/update-form", {ticketFromDB} ))
    .catch((error) => console.log(`Error while updating a ticket: ${error}`));
})


router.get('/myTickets', (req, res) => {
   Ticket.find({user: req.session.passport.user})
  .then((ticketUsers) => {
   res.render("tickets/myTickets", { tUser: ticketUsers});
  })
  .catch((err) =>
    console.error(`Err while displaying tickets in My tickets Page: ${err}`)
  ); 
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
