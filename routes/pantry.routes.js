const router = require("express").Router();
const bcryptjs = require('bcryptjs');
const mongoose = require('mongoose');

const User = require('../models/User.model');
const Pantry = require('../models/Pantry.model');
const Product = require('../models/Product.model');

const { isLoggedIn } = require('../middleware/route.gaurd');

const ProductService = require('../services/product.service');
const productService = new ProductService();



// ****** RENDER PANTRY CREATION VIEW ****** //
router.get('/pantry/create', isLoggedIn, (req, res, next) => {
  res.render('pantry/pantry-create')
})


//****** RENDER PANTRY NAME CHANGE VIEW ******//
router.get('/pantry/edit/:id', isLoggedIn, (req, res, next) => {
  pantryId = req.params.id

  Pantry.findById(pantryId)
  .then(pantryFound => {
    console.log(pantryFound)
    res.render('pantry/pantry-edit', { pantryFound })
  })
  .catch(err => console.log(err))
})


//****** RENDER MANAGE PANTRY VIEW ******//
router.get('/pantry/manage/:id', isLoggedIn, (req, res, next) => {
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
router.get('/pantry/manage/product/details/:id', isLoggedIn, (req, res, next) => {
  const pantryProductId = req.params.id

  Product.findById(pantryProductId)
  .then(productFound => {
    console.log(productFound)
    res.render('pantry/pantry-product-detail', { product:productFound } )
  })
  .catch(error => console.log(error));
})


//****** HANDLE PANTRY NAME CHANGE ******//
router.post('/pantry/edit/:id', isLoggedIn, (req, res, next) => {
  pantryId = req.params.id
  const { name } = req.body

  Pantry.findByIdAndUpdate(pantryId, {name})
  .then(pantryUpdated => {
    res.redirect('/manage'); 
  })
  .catch(err => console.log(err))
})


//****** HANDLE PANTRY CREATION THEN APPEND CREATED PANTRY TO USER  ******//
router.post('/pantry/create', isLoggedIn, (req, res, next) => {
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


//****** HANDLE PANTRY PRODUCT QTY CHANGES ******//
router.post('/pantry/product/qty', isLoggedIn, (req, res, next) => {
  const {qty, productId} = req.body
 

  Product.findByIdAndUpdate(productId, {qty:qty})
  .then(productUpdated => {
    res.redirect(`/pantry/manage/${productUpdated.pantryId}`)
  })
  .catch(err => console.log(err))
})


//****** HANDLE PRODUCT REMOVAL: DELETES PRODUCT AND REMOVE REFERENCE FROM PANTRY ******//
router.get('/pantry/manage/product/remove/:id', isLoggedIn, (req, res, next) => {
  const productId = req.params.id

  Product.findByIdAndDelete(productId)
    .then(productRemoved => {
      // ** without the 'return', it will not actually remove product reference from pantry ** //
      return Pantry.findByIdAndUpdate(productRemoved.pantryId, { $pull: { products: productRemoved._id } })
    })
    .then(() => {
      res.redirect(`/pantry/manage/${pantryId}`)
    })
    .catch(err => console.log(err))
})


//****** HANDLE PANTRY DELETION: DELETES PANTRY AND REMOVE REFERENCE FROM USER ******// 
router.get('/pantry/delete/:id', isLoggedIn, (req, res, next) => {
  pantryId = req.params.id

  Pantry.findById(pantryId)
  .then(pantryFound => {
    if (pantryFound.products.length === 0) {
      Pantry.findByIdAndDelete(pantryId)
        .then(pantryRemoved => {
          // ** without the 'return', it will not actually remove the pantry reference from user?!? - lame.. ** //
          return User.findByIdAndUpdate(pantryRemoved.owner, { $pull: { pantries: pantryRemoved._id} })
        })
        .then(() => {
          res.redirect('/manage')
        })
    } else {
      res.render('user/user-manage', { errorMessage: 'Cannot delete pantries which contain products.' });
    }
  })
  .catch(err => console.log(err))
})


module.exports = router;