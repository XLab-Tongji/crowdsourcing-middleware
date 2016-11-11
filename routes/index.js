var express = require('express');
var router = express.Router();

/* GET bootstap. */
router.get('/', function(req, res, next) {
  res.send('哈哈哈你来了呀');
  console.log('api server up :)')
});

module.exports = router;
