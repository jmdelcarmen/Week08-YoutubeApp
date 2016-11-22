'use strict';

const Video = require('../models/video');

module.exports.displayUpload = (req, res) => {
  res.render('user/upload');
}

module.exports.uploadVideo = (req, res) => {
  new Video(req.body).save((e) => {
    if(e) throw e;
    console.log('Video uploaded');
  });
}
