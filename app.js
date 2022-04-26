require("dotenv/config");
require("./db");


const express = require("express");
const hbs = require("hbs");
const app = express();
hbs.registerPartials(__dirname + "/views/partials");


require('./config/session.config')(app);
require("./config")(app);


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