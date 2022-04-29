const router = require("express").Router();
const bcryptjs = require('bcryptjs');
const mongoose = require('mongoose');

const User = require('../models/User.model');
const Pantry = require('../models/Pantry.model');

//****** RENDER USER MANAGE VIEW ******//
router.get('/manage', (req, res, next) => {

  Pantry.find( {owner: req.app.locals.currentUser._id } ) 
  .then(pantriesFound => {
    res.render('user/user-manage', { pantry:pantriesFound })
  })
  .catch(err => console.log(err))
})


//****** RENDER LOGIN VIEW ******//
router.get('/login', (req, res, next) => {
  res.render('user/user-login');
})


//****** RENDER USER/PROFILE EDIT VIEW ******//
router.get('/edit/:id', (req, res, next) => {
  userId = req.params.id

  User.findById(userId)
  .then(userFound => {
    res.render('user/user-edit', { user: userFound })
  }) 
  .catch(err => console.log(err))
})


//****** HANDLE USER/PROFILE UPDATES ******//
router.post('/edit/:id', (req, res, next) => {
  const { displayName, email } = req.body
  userId = req.params.id

  User.findByIdAndUpdate(userId, {displayName}, {returnOriginal: false})
  .then(userUpdated => {
    req.session.currentUser.displayName = userUpdated.displayName
  })
  .then(() => {
    res.redirect('/manage')
  })
  .catch(err => console.log(err))

  //  ATTEMPT AT HANDLING PROVIDING BLANK
  // if (displayName === '') {
  //   res.render('user/user-edit', { errorMessage: 'Must provide a Display Name' })
  // } else {
  //   User.findByIdAndUpdate(userId, {displayName}, {returnOriginal: false})
  //   .then(userUpdated => {
  //     req.session.currentUser.displayName = userUpdated.displayName
  //   })
  //   .then(() => {
  //     res.redirect('/manage')
  //   })
  //   .catch(err => console.log(err))
  // }

  // User.findByIdAndUpdate(userId, {displayName}, {returnOriginal: false})
  // .then(userUpdated => {
  //   req.session.currentUser.displayName = userUpdated.displayName
  //   res.redirect('/manage')
  // })
  // .catch(err => console.log(err))
})


//****** HANDLE NEW USER CREATION/SIGNUP ******//
router.post('/signup', (req, res, next) => {
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  const { displayName, email, password, confirmPassword } = req.body

  // ** Ensure all fields have been provided ** //
  if (!displayName || !email || !password || !confirmPassword) {
    res.render('index', { errorMessage: 'All fields are mandatory. Please provide your username, email and password.' });
    return;
  }

  // ** Ensure password fields match ** //
  if (!(password === confirmPassword)) {
    res.render('index', { errorMessage: 'Passwords provided must match.' });
    return;
  }

  // ** Check password format ** //
  if (!regex.test(password)) {
    res
      .status(500)
      .render('index', { errorMessage: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.' });
    return;
  }

  // ** Hash password and create user, if success -> render "user manage page" **//
  bcryptjs
  .hash(password, 10)
  .then(hashedPassword => {
    User.create({ displayName, email, password: hashedPassword })
    .then(userCreated => { req.session.currentUser = userCreated })
    .then(() => {res.redirect('/manage')})
    .catch(error => {
      // ** If user creation failed, handle mongoDB valiation errors ** //
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(500).render('index', { errorMessage: error.message });
      } else if (error.code === 11000) {
        res.status(500).render('index', { errorMessage: 'Email is already in use.' });
      } else {
        next();
      }
      })
  }) 
  .catch(error => {console.log(error)}); 
});


//****** HANDLE USER LOGIN ******//
router.post('/login', (req, res, next) => {
  const { email, password } = req.body

  if (email === '' || password === '') {
    res.render('user/user-login', {errorMessage: 'Please enter both, email and password to login.'});
    return;
  }

  User.findOne({ email })
    .then(user => {
      if (!user) {  
        res.render('user/user-login', { errorMessage: 'Email is not registered. Try with other email.' });
        return;
      } else if (bcryptjs.compareSync(password, user.password)) { 
        req.session.currentUser = user;
        res.redirect('/manage'); 
      } else {
        res.render('user/user-login', { errorMessage: 'Incorrect password.' });
      }
    })
    .catch(error => next(error));
})


//****** HANDLE USER LOGOUT ******//
router.get('/logout', (req, res, next) => {
  req.session.destroy(err => {
    if (err) next(err);
    res.redirect('/');
  });
});


module.exports = router;