const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  if (req.session.currentUser) {
    res.redirect('/manage')
  } else {
    res.render("index")
  }
});

module.exports = router;