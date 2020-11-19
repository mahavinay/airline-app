
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



/* router.get("/myTickets/:id/update-form", (req, res) => {
  const { id } = req.params;
     Ticket.findById(id)
     .then((ticketFromDB) => res.render("tickets/update-form", {ticketFromDB} ))
    .catch((error) => console.log(`Error while updating a ticket: ${error}`));
}) */


router.get('/myTickets', (req, res) => {
  console.log(req.session.passport.user);
   Ticket.find({user: req.session.passport.user})
  .then((ticketUsers) => {
   res.render("tickets/myTickets", { tUser: ticketUsers});
  })
  .catch((err) =>
    console.error(`Err while displaying tickets in My tickets Page: ${err}`)
  ); 
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
    Ticket.create({ origin, destination, quantity, date, user:req.session.passport.user } )
  .then((dbUsers) => {
    res.render("private", { dbUsers });
  })
  .catch((err) =>
  console.error(`Err while creating and updating ticket in the DB: ${err}`)
  );
  });


router.get('/myTickets/:id/update-form', (req, res) => {
  const { id } = req.params
  Ticket.findById(id)
  .then((ticketToEdit) => {
    res.render("tickets/update-form", ticketToEdit)
    /* console.log(ticketToEdit)
    const countriesArray = ["Spain", "England", "United States", "The Netherlands", "China", "United Arab Emirates"]

    const isOriginIncluded = countriesArray.includes(ticketToEdit.origin)
    const isDestinationIncluded = countriesArray.includes(ticketToEdit.destination)

    if (isOriginIncluded && isDestinationIncluded) {
      const newCountriesArray = countriesArray.filter((element) => element !== ticketToEdit.origin)
      const newCountriesArrayTwo = countriesArray.filter(element => element !== ticketToEdit.destination)

      console.log("New Countries", newCountriesArray)
      console.log("New Countries Two", newCountriesArrayTwo)

      const {_id, origin, destination, quantity, date} = ticketToEdit

      const newTicket = {_id, origin, destination, quantity, date, chosenCountry: true}
      console.log("NEW", newTicket)
      res.render("tickets/update-form", {newTicket: newTicket, newCountriesArray, newCountriesArrayTwo})
      
    } else {
      res.render("tickets/update-form", ticketToEdit)
    } */
  })
  .catch((error) =>
    console.log(`Error while making edits to ticket: ${error}`))
});

router.post('/myTickets/:id/update-form', (req, res) => {
  const { id } = req.params;
  console.log("id",_id);
  const {origin, destination, quantity, date} = req.body
  console.log("REQBODY",req.body);
  Ticket.findByIdAndUpdate(id, {origin, destination, quantity, date},{ new: true } )
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
