const router = require("express").Router();
const bcryptjs = require('bcryptjs');
const mongoose = require('mongoose');

const User = require('../models/User.model');
const Pantry = require('../models/Pantry.model');


// ****** RENDER PANTRY CREATION VIEW ****** //
router.get('/pantry/create' , (req, res, next) => {
  res.render('pantry/pantry-create')
})


//****** RENDER PANTRY NAME CHANGE VIEW ******//
router.get('/pantry/edit/:id' , (req, res, next) => {
  pantryId = req.params.id

  Pantry.findById(pantryId)
  .then(pantryFound => {
    console.log(pantryFound)
    res.render('pantry/pantry-edit', { pantryFound })
  })
  .catch(err => console.log(err))
})


//****** HANDLE PANTRY NAME CHANGE ******//
router.post('/pantry/edit/:id' , (req, res, next) => {
  pantryId = req.params.id
  const { name } = req.body

  Pantry.findByIdAndUpdate(pantryId, {name})
  .then(pantryUpdated => {
    res.redirect('/manage'); 
  })
  .catch(err => console.log(err))
})


//****** HANDLE PANTRY CREATION  ******//
router.post('/pantry/create' , (req, res, next) => {
  const {name} = req.body
  let owner = (req.session.currentUser._id)

  Pantry.create( {owner: owner, name} )
  .then(pantryCreated => {
    console.log(`${pantryCreated.name} has been created.`)
    res.redirect('/manage'); 
  })
  .catch(err => console.log(err))
})


//****** HANDLE PANTRY DELETION ******//
router.get('/pantry/delete/:id', (req, res, next) => {
  pantryId = req.params.id

  Pantry.findByIdAndDelete(pantryId)
  .then(pantryRemove => {
    res.redirect('/manage'); 
  })
})


module.exports = router;