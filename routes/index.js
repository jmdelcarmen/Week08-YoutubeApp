'use strict';

const Video = require('../models/video');
const Category = require('../models/category');
const q = require('q');

//Display homepage
module.exports.dashboard = (req, res) => {
  //queries
  const categoryQ = Category.find().exec();
  const videoQ = Video.find().exec();
  q.all([categoryQ, videoQ])
    .then(data => {
      res.render('index', {
        title: 'Featured',
        videos: data[1],
        categories: data[0]
      });
    })
    .catch(err => {
      req.flash('error', 'Could not load videos');
    });
  }

module.exports.showCategory = (req, res) => {
  //queries
  const categoryQ = Category.find().exec();
  const videoQ = Video.find({category: req.params.category}).exec();
  q.all([categoryQ, videoQ])
    .then(data => {
      res.render('index', {
        title: req.params.category,
        videos: data[1],
        categories: data[0]
      });
    })
    .catch(err => {
      req.flash('error', 'Could not load videos');
    });
  }

//Display main video
module.exports.displayVideo = (req, res) => {
  //queries
  const addViewCount = Video.findByIdAndUpdate(req.params.id, {$inc: {views: 1}}).exec();
  const mainVideoQ = Video.findById(req.params.id).exec();
  const publicVideoQ = Video.find().exec();

  q.all([addViewCount, mainVideoQ, publicVideoQ])
    .then(data => {
      console.log(data);
      res.render('video', {
        mainVideo: data[1],
        publicVideos: data[2],
        user: req.user
      });
    })
    .catch(err => {
      req.flash('error', 'Fail to load video.');
    });
}



////////////////////////////////////////////////////
////////////////////////////////////////////////////Add Angular functionality here
////////////////////////////////////////////////////
module.exports.addcomment = (req, res) => {
  if (req.user) {
    Video.findOneAndUpdate({_id: req.params.id}, {$push: {comments: {comment_body: req.body.comment_body, comment_date: new Date(), username: req.user.username, profileImage: req.user.profileImage}}},(err, video) => {
      if (err) {
        res.status(500).send('Failed to add comment');
      }
      res.redirect(`/video/${req.params.id}`);
    });
  } else {
    req.flash('error', 'Please sign in to leave a comment.');
    res.redirect('/users/login');
  }
}

module.exports.likeVideo = (req, res) => {
//fetch video and add a like
  Video.findOne({_id: req.params.id}, (err, video) => {
    if (err) {
      req.flash('error', 'Failed to like video.');
    }
    if (video.liked_users.indexOf(req.user.username) === -1) {
      video.likes ++;
      video.liked_users.push(req.user.username);
      video.save();
    } else {
      req.flash('info', 'You already like this video');
    }
    res.redirect(`/video/${req.params.id}`);
    // console.log(video);
  });
}
