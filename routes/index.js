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
  Video.findByIdAndUpdate(req.params.id, {$inc: {views: 1}}, (e, video) => {
    if (e) console.log(e.message);
    console.log('Video viewed.');
  });

  let publicVideos = [];
  Video.find({}, (err, videos) => {
    if (err) req.flash('error', 'Fail to load videos.');
    publicVideos = videos;
    Video.findById(req.params.id, (err, video) => {
      if(err) req.flash('error', 'Fail to load video.');
      res.render('video', {
        mainVideo: video,
        publicVideos: publicVideos
      });
    });
  });
}
