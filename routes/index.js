'use strict';

const Video = require('../models/video');
const Category = require('../models/category');
const q = require('q');

//Display homepage
module.exports.dashboard = (req, res) => {
  //queries
  const categoryQ = Category.find().exec();
  const videoQ = Video.find({}, {title: true, url:true}).exec();
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
  const publicVideosQ = Video.find({}, {url: true, title: true, views: true}).exec();

  q.all([addViewCount, mainVideoQ, publicVideosQ])
    .then(data => {
      res.render('video', {
        mainVideo: data[1],
        publicVideos: data[2],
        user: req.user
      });
      res.json(data)
    })
    .catch(err => {
      req.flash('error', 'Fail to load video.');
    });
  }

module.exports.getComments = (req, res) => {
  //queries
  const commentsQ = Video.findById(req.params.id).exec();

  q.all([commentsQ])
    .then( video => {
      res.json(video[0].comments);
    })
    .catch( err => {
      req.flash('error', 'Fail to load video.');
    });
  }



////////////////////////////////////////////////////
////////////////////////////////////////////////////Add Angular functionality here
////////////////////////////////////////////////////
module.exports.addcomment = (req, res) => {
  if (req.user) {
    Video.findOneAndUpdate({_id: req.body.id}, {$push: {comments: {comment_body: req.body.comment_body, comment_date: new Date(), username: req.user.username, profileImage: req.user.profileImage}}},(err, video) => {
      if (err) {
        res.status(500).send('Failed to add comment');
      }
      res.json({
        comment_body: req.body.comment_body,
        username: req.user.username,
        profileImage: req.user.profileImage,
        comment_date: new Date()
      });
    });
  } else {
    req.flash('error', 'Please sign in to leave a comment.');
    res.status(400).send();
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
