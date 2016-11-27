'use strict';

const Video = require('../models/video');

module.exports.displayUpload = (req, res) => {
  res.render('user/upload');
}

module.exports.uploadVideo = (req, res) => {
  new Video({
    url: req.body.url,
    title: req.body.title,
    desc: req.body.desc,
    category: req.body.category,
    publisher: {
      username: req.user.username,
      profileImage: req.user.profileImage
    },
    published_at: req.body.published_at
  })
  .save((e) => {
    if(e) {
      req.flash('error', 'Failed to upload video.');
      res.redirect('/users/upload');
    } else {
      console.log('Video uploaded');
    }
  });
}

module.exports.displayResults = (req, res) => {
  Video.find({title: {$regex: req.body.search, $options: 'ig'}}, (err, videos) => {
    req.flash('info', 'Search results: ' + videos.length);
    res.render('index', {
      videos: videos
    });
  })
}
