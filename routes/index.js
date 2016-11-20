const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Video = require('../models/video');

/* GET home page. */
router.get('/', (req, res, next) => {
  Video.find({}, (e, videos) => {
    if(e) throw e;

    res.render('index', {
      title: 'Dashboard',
      videos: videos,
      user: req.user
    });
  });
});

router.get('/video/:id', (req, res) => {
  Video.findById(req.params.id, (e, video) => {
    if(e) throw e;

    res.render('video', {
      video: video,
      comments: video.comments,
      user: req.user
    });

  });
});



function ensureAuthenticated (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/users/login');
  }
};

module.exports = router;
