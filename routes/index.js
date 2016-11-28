const User = require('../models/user');
const Video = require('../models/video');

//Display homepage
module.exports.dashboard = (req, res) => {
  Video.find({}, (e, videos) => {
    if(e) req.flash('error', 'Could not load videos');
    res.render('index', {
      title: 'Dashboard',
      videos: videos
    });
  });
}

//Display main video
module.exports.displayVideo = (req, res) => {
  Video.findByIdAndUpdate(req.params.id, {$inc: {views: 1}}, (e, video) => {
    if (e) console.log(e.message);
    console.log('Video viewed.');
  });

  let publicVideos = [];
  //get all videos
  Video.find({}, (err, videos) => {
    if (err) req.flash('error', 'Fail to load videos.');
    publicVideos = videos;
    //get main video
    Video.findById(req.params.id, (err, video) => {
      if(err) req.flash('error', 'Fail to load video.');
      res.render('video', {
        mainVideo: video,
        publicVideos: publicVideos,
        user: req.user
      });
    });
  });
}

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
