const router = require("express").Router();
const bcryptjs = require('bcryptjs');
const mongoose = require('mongoose');

const User = require('../models/User.model');
const Pantry = require('../models/Pantry.model');
const Product = require('../models/Product.model');

const ProductService = require('../services/product.service');
const productService = new ProductService();

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


//****** RENDER MANAGE PANTRY VIEW ******//
router.get('/pantry/manage/:id' , (req, res, next) => {
  pantryId = req.params.id

  Pantry.findById(pantryId)
  .populate('products')
  .then(pantryFound => {
    res.render('pantry/pantry-manage', { pantry:pantryFound })
  })
  .catch(err => console.log(err))
})


//************** RENDER PRODUCT DETAILS VIEW FROM MANAGE PANTRY *****************//
//****** We will use the pantry product id now (versus UPC/barcode_number) ******//
router.get('/pantry/manage/product/details/:id', (req, res, next) => {
  const pantryProductId = req.params.id

  Product.findById(pantryProductId)
  .then(productFound => {
    console.log(productFound)
    res.render('pantry/pantry-product-detail', { product:productFound } )
  })
  .catch(error => console.log(error));
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


//****** HANDLE PANTRY CREATION THEN APPEND CREATED PANTRY TO USER  ******//
router.post('/pantry/create' , (req, res, next) => {
  const {name} = req.body
  let owner = (req.session.currentUser._id)

  Pantry.create( {owner: owner, name} )
  .then(pantryCreated => {
    console.log(`${pantryCreated.name} has been created.`)
    return User.findByIdAndUpdate(owner, { $push: { pantries: pantryCreated._id}})
  })
  .then(() => res.redirect('/manage'))
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