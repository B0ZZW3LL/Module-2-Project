require("dotenv/config");
require("./db");


const express = require("express");
const hbs = require("hbs");
const app = express();


require('./config/session.config')(app);
require("./config")(app);


// **** HANDLING ROUTES HERE **** //
const index = require("./routes/index.routes");
app.use("/", index);

const userRouter = require("./routes/user.routes");
app.use("/", userRouter)




require("./error-handling")(app);

module.exports = app;