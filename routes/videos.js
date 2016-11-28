'use strict';

const Video = require('../models/video');

module.exports.displayUpload = (req, res) => {
  res.render('user/upload', {key: process.env.FILESTACK_KEY});
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

module.exports.editVideo = (req, res) => {
  Video.findById(req.params.id, (err, video) => {
    if (err) {
      req.flash('err', 'Failed to find video.');
      res.redirect(`/users/userprofile/${req.user._id}`);
    }
    res.render('user/edit', {video: video});
  })
}

module.exports.saveEditedVideo = (req, res) => {
  Video.findOne({_id: req.params.id}, (err, video) => {
    if (err) {
      req.flash('err', 'Failed to save changes.');
      res.redirect('/users/userprofile');
    }
    video.title = req.body.title;
    video.desc = req.body.desc;
    video.category = req.body.category;
    video.save(err => {
      if (err) {
        res.redirect('/users/userprofile');
        req.flash('err', 'Failed to save changes.');
      }
    });
  });
  req.flash('success', 'Video edited');
  res.redirect('/users/userprofile/');
}

module.exports.deleteVideo = (req, res) => {
  Video.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      req.flash('error', 'Failed to delete video.');
      res.redirect('/users/userprofile');
    }
    req.flash('success', 'Video delete');
    res.redirect('/users/userprofile');
  })
}
