'use strict';

const mongoose = require('mongoose');

let videoSchema = mongoose.Schema({
  url: {type: String, unique: true},
  title: {type: String},
  desc: {type: String},
  channel: {
    title: {type: String},
    url: {type: String}
  },
  published_at: {type: Date, default: new Date().toDateString()},
  tags: {type: Array},
  comments: [{
    //add user object
    username: {type: String},
    comment_body: {type: String},
    comment_date: {type: Date, default: new Date().toDateString()}
  }],
  views: {type: Number},
  likes: {type: Number}
});

module.exports = mongoose.model('Video', videoSchema);
