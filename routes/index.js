var express = require('express');
var router = express.Router();

/* GET bootstap. */
router.get('/', function(req, res, next) {
  console.log('api server up :)')
});

module.exports = router;
