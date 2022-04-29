require("dotenv/config");
require("./db");


const express = require("express");
const hbs = require("hbs");
const app = express();
hbs.registerPartials(__dirname + "/views/partials");


require('./config/session.config')(app);
require("./config")(app);

// **** After successful login, setting app.local.currentUser to user object found from db **** //
app.use( (req, res, next) => {
  if (req.session.currentUser) {
    app.locals.currentUser = req.session.currentUser;
  } else {
    app.locals.currentUser = undefined;
  }
  next();
})

// **** HANDLING ROUTES HERE **** //
const index = require("./routes/index.routes");
app.use("/", index);

const userRouter = require("./routes/user.routes");
app.use("/", userRouter)

const pantryRouter = require("./routes/pantry.routes");
app.use("/", pantryRouter)

const productRouter = require("./routes/product.routes");
app.use("/", productRouter)


require("./error-handling")(app);

module.exports = app;