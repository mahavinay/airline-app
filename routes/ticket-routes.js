const express = require('express');
const ticketModel = require('../models/ticket.model');

const router = express.Router();

router.get('/ticket/list', (req, res) => {
  ticketModel.find({})
  .then((ticketFromDB) => {
    res.render('ticket/list', { ticketFromDB })
  })
  .catch((error) => `Error while fetching ticket: ${error}`)
});

router.get('/ticket/create', (req, res, next) => {
  res.render('ticket/create-form')
});

router.post('/ticket/create', (req, res, next) => {
  const { date, origin, destination, quantity } = req.body;

  ticketModel.create({ date, origin, destination, quantity })
    .then(() => res.redirect("/ticket/list"))
    .catch(() => res.render("/ticket/create"))
});
router.get('/ticket/:id/update-form', (req, res) => {
  const { id } = req.params

  ticketModel.findById(id)
  .then((ticketToEdit) => {
    res.render("ticket/update-form", ticketToEdit)
  })
  .catch((error) =>
    console.log(`Error while making edits to ticket: ${error}`))
});
router.post('/ticket/:id/update-form', (req, res) => {
  const { id } = req.params;
  const { date, origin, destination, quantity } = req.body;


  ticketModel.findByIdAndUpdate(
    id,
    { date, origin, destination, quantity },
    { new: true }
  )
  .then(() => res.redirect('/ticket/list'))
  .catch(() => res.render("/ticket/:id/update-form"))
});

router.post('/ticket/:id/delete', (req, res, next) => {
  const { id } = req.params;

  ticketModel.findByIdAndDelete(id)
  .then(() => res.redirect('/ticket/list'))
  .catch((err) => 
    console.log(`An error occurred while making changes to your ticket : ${err}`))
});

module.exports = router;