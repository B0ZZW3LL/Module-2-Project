const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');

const myMiddleWareFunction = app => {
  app.set('trust proxy', 1);

  app.use(
    session({
      secret: process.env.SESS_SECRET,
      resave: true,
      saveUninitialized: false,
      cookie: {
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 600000 // <- 10 minutes
      }, 
      store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI || "mongodb://localhost/project-pantry-app"
      })
    })
  );
};

module.exports = myMiddleWareFunction;