var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'TikTokWeb', videoData: ''});
});

router.get('/index', function(req, res, next) {
  res.render('index', { title: 'TikTokWeb', videoData: '' });
});

module.exports = router;
