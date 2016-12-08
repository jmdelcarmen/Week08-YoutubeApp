'use strict';

const Video = require('../models/video');
const Category = require('../models/category');
const q = require('q');

module.exports.displayUpload = (req, res) => {
  //queries
  const categoryQ = Category.find().exec();

  q.all([categoryQ])
    .then(data => {
      console.log(data[0]);
      res.render('user/upload', {
        key: process.env.FILESTACK_KEY,
        categories: data[0]
      });
    })
    .catch(err => {
      res.status(500).send('Failed to load video categories.');
    });
}

module.exports.uploadVideo = (req, res) => {
  //queries
  const saveVideo = new Video({
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
  .save().exec();

  q.all([saveVideo])
    .then(data => {
      console.log('Video Saved');
    })
    .catch(err => {
      res.status(500).send('Failed to upload video.');
    });
}


module.exports.displayResults = (req, res) => {
  //queries
  const videosQ = Video.find({title: {$regex: req.body.search, $options: 'ig'}}).exec();
  const categoryQ = Category.find().exec();

  q.all([videosQ, categoryQ])
    .then(data => {
      req.flash('info', 'Search results: ' + data[0].length);
      res.render('index', {
        videos: data[0],
        categories: data[1]
      });
    })
    .catch(err => {
      res.status(500).send('Failed to load videos.');
    });
}

module.exports.editVideo = (req, res) => {
  //queries
  const videosQ = Video.findById(req.params.id).exec();
  const categoryQ = Category.find().exec();

  q.all([videosQ, categoryQ])
    .then(data => {
      res.render('user/edit', {
        video: data[0],
        categories: data[1]
      });
    })
    .catch(err => {
      req.flash('err', 'Failed to find video.');
      res.redirect(`/users/userprofile/${req.user._id}`);
    });
}

module.exports.saveEditedVideo = (req, res) => {
  //queries
  const videoQ = Video.findById(req.params.id).exec();

  q.all([videoQ])
    .then(video => {
      video = video[0];
      video.title = req.body.title;
      video.desc = req.body.desc;
      video.category = req.body.category;
      video.save();
      req.flash('success', 'Video edited');
      res.redirect('/users/userprofile/');
    })
    .catch(err => {
      res.redirect('/users/userprofile');
      req.flash('err', 'Failed to save changes.');
    });
}

module.exports.deleteVideo = (req, res) => {
  //queries
  const deleteVideo = Video.findByIdAndRemove(req.params.id).exec();

  q.all([deleteVideo])
    .then(video => {
      req.flash('success', 'Video delete');
      res.redirect('/users/userprofile');
    })
    .catch(err => {
      req.flash('error', 'Failed to delete video.');
      res.redirect('/users/userprofile');
    });
}
