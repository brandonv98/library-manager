var express = require('express');
var router = express.Router();

/* GET home page and redirect to /books */
router.get('/', function(req, res, next) {
  res.redirect('/books');
});

module.exports = router;
