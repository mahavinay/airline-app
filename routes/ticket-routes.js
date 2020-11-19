/* const express = require('express');
const ticketModel = require('../models/ticket.model');

const router = express.Router();

router.get('/tickets/list', (req, res) => {
  ticketModel.find({})
  .then((ticketFromDB) => {
    res.render('tickets/list', { ticketFromDB })
  })
  .catch((error) => `Error while fetching ticket: ${error}`)
});

router.get('/tickets/create', (req, res, next) => {
  res.render('tickets/create-form')
});

router.post('/tickets/create', (req, res, next) => {
  const { date, origin, destination, quantity } = req.body;

  ticketModel.create({ date, origin, destination, quantity })
    .then(() => res.redirect("/tickets/list"))
    .catch(() => res.render("/tickets/create"))
});
router.get('/tickets/update-form', (req, res) => {
  const { id } = req.params

  ticketModel.findById(id)
  .then((ticketToEdit) => {
    res.render("tickets/update-form", ticketToEdit)
  })
  .catch((error) =>
    console.log(`Error while making edits to ticket: ${error}`))
});
router.post('/tickets/update-form', (req, res) => {
  const { id } = req.params;
  const { date, origin, destination, quantity } = req.body;


  ticketModel.findByIdAndUpdate(
    id,
    { date, origin, destination, quantity },
    { new: true }
  )
  .then(() => res.redirect('/tickets/list'))
  .catch(() => res.render("/tickets/update-form"))
});

router.post('/tickets/delete', (req, res, next) => {
  const { id } = req.params;

  ticketModel.findByIdAndDelete(id)
  .then(() => res.redirect('/tickets/list'))
  .catch((err) => 
    console.log(`An error occurred while making changes to your ticket : ${err}`))
});

module.exports = router; */