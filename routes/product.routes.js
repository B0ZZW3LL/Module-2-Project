const router = require("express").Router();
const bcryptjs = require('bcryptjs');
const mongoose = require('mongoose');

const User = require('../models/User.model');
const Pantry = require('../models/Pantry.model');

const ProductService = require('../services/product.service');
const productService = new ProductService();


//****** RENDER PRODUCT SEARCH VIEW ******//
router.get('/product-search', (req, res, next) => {
  res.render('product/product-search')
})


//***** GET ALL PRODUCTS ******//
router.get('/product-list', (req, res, next) => {
  let currentUser = req.session.currentUser

  productService
  .getAllProducts()
  .then(productsFound => {
    let products = productsFound.data.map(element => {
      let properties = {
        "title": element.title,
        "category": element.category,
        "brand": element.brand,
        "image": element.images[0]
      }
      return properties;
    })
    res.render('product/product-search', { currentUser,  products } )
  })
  .catch(error => console.log(error));
})


//***** GET PRODUCT BY UPC ******//
router.post('/product-search-upc', (req, res, next) => {
  const { upcNumber } = req.body
  
  productService
  .getOneProductUPC(upcNumber)
  .then(productsFound => {
    let products = productsFound.data.map(element => {
      let properties = {
        "title": element.title,
        "category": element.category,
        "brand": element.brand,
        "image": element.images[0]
      }
      return properties;
    })
    res.render('product/product-search', { products } )
  })
  .catch(error => console.log(error));
})


//***** GET PRODUCTs BY NAME/TITLE SEARCH ******//
router.post('/product-search-title', (req, res, next) => {
  const searchTerm = req.body.title

  productService
  .getProductTitles(searchTerm)
  .then(productsFound => {
    let products = productsFound.data.map(element => {
      let properties = {
        "title": element.title,
        "category": element.category,
        "brand": element.brand,
        "image": element.images[0]
      }
      return properties;
    })
    res.render('product/product-search', { products } )
  })
  .catch(error => console.log(error));
})

module.exports = router;