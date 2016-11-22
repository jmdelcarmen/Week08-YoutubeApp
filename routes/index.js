const User = require('../models/user');
const Video = require('../models/video');

//Display homepage
module.exports.dashboard = (req, res, next) => {
  Video.find({}, (e, videos) => {
    if(e) req.flash('error', 'Could not load videos');

    res.render('index', {
      title: 'Dashboard',
      videos: videos
    });
  });
}

//Display single video
module.exports.displayVideo = (req, res) => {
  Video.findById(req.params.id, (e, video) => {
    if(e) req.flash('error', 'Could not load video.');

    res.render('video', {
      video: video,
      comments: video.comments
    });
  });
}
