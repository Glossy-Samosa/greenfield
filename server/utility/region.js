var express = require('express');
var router = express.Router();

router.post('/', function(req, res) {
  res.send('POST api/region endpoint');
});

module.exports = router;