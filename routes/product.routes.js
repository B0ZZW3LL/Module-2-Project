const router = require("express").Router();
const bcryptjs = require('bcryptjs');
const mongoose = require('mongoose');

const User = require('../models/User.model');
const Pantry = require('../models/Pantry.model');
const Product = require('../models/Product.model');

const { isLoggedIn } = require('../middleware/route.gaurd');

const ProductService = require('../services/product.service');
const productService = new ProductService();

 

//****** RENDER PRODUCT SEARCH VIEW ******//
router.get('/product-search', isLoggedIn,  (req, res, next) => {
  res.render('product/product-search')
})


//****** RENDER PRODUCT DETAILS VIEW & POPULATE USER ALONG WITH LINKED PANTRIES******//
router.get('/product-details/:id', isLoggedIn,  (req, res, next) => {
  const barcode_number = req.params.id

  productService
  .getOneProductUPC(barcode_number)
  .then(productFound => {
    let product = productFound.data
    User.findById(req.session.currentUser._id)
    .populate('pantries')
    .then(userFound => {
      let user = userFound
      res.render('product/product-detail', { user, product } )
    })
  })
  .catch(error => console.log(error));
})


//***** GET ALL PRODUCTS ******//
router.get('/product-list', isLoggedIn,  (req, res, next) => {
  let currentUser = req.session.currentUser

  productService
  .getAllProducts()
  .then(productsFound => {
    let products = productsFound.data.map(element => {
      let properties = {
        "title": element.title,
        "category": element.category,
        "brand": element.brand,
        "image": element.images[0],
        "barcode_number": element.barcode_number
      }
      return properties;
    })
    res.render('product/product-search', { currentUser,  products } )
  })
  .catch(error => console.log(error));
})


//***** GET PRODUCT BY UPC ******//
router.post('/product-search-upc', isLoggedIn,  (req, res, next) => {
  const { barcode_number } = req.body
  
  productService
  .getOneProductUPC(barcode_number)
  .then(productsFound => {
    let products = productsFound.data.map(element => {
      let properties = {
        "title": element.title,
        "category": element.category,
        "brand": element.brand,
        "image": element.images[0],
        "barcode_number": element.barcode_number
      }
      return properties;
    })
    res.render('product/product-search', { products } )
  })
  .catch(error => console.log(error));
})


//***** GET PRODUCTs BY NAME/TITLE SEARCH ******//
router.post('/product-search-title', isLoggedIn,  (req, res, next) => {
  const searchTerm = req.body.title

  productService
  .getProductTitles(searchTerm)
  .then(productsFound => {
    let products = productsFound.data.map(element => {
      let properties = {
        "title": element.title,
        "category": element.category,
        "brand": element.brand,
        "image": element.images[0],
        "barcode_number": element.barcode_number
      }
      return properties;
    })
    res.render('product/product-search', { products } )
  })
  .catch(error => console.log(error));
})


//***** HANDLE PRODUCT CREATE AND ADDING TO SPECIFIED PANTRY ******//
router.post('/product-create', isLoggedIn, (req, res, next) => {
  const { 
    image, 
    barcode_number, 
    title, 
    brand, 
    size, 
    category, 
    description, 
    manufacturer, 
    qty, 
    pantryId 
  } = req.body

  Product.create( {image, 
    barcode_number, 
    title, 
    brand, 
    size, 
    category, 
    description, 
    manufacturer, 
    qty,
    pantryId })

    .then(productCreated => {
      return Pantry.findByIdAndUpdate(pantryId, { $push: { products: productCreated._id }})
    })
    .then(() => {
      console.log('Product added to pantry')
      res.redirect('/product-list')
    })
    .catch(err => console.log(err))
})


module.exports = router;