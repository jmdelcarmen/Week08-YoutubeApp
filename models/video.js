'use strict';

const mongoose = require('mongoose');

let videoSchema = mongoose.Schema({
  url: {type: String, unique: true, required: true},
  title: {type: String},
  desc: {type: String},
  publisher: {
    username: {type: String},
    profileImage: {type: String}
  },
  published_at: {type: Date, default: Date.now},
  category: {type: String},
  comments: [{
    username: {type: String},
    profileImage: {type: String},
    comment_body: {type: String},
    comment_date: {type: Date, default: Date.now}
  }],
  views: {type: Number, default: 0},
  likes: {type: Number, default: 0},
  liked_users: {type: Array, unique: true}
});

module.exports = mongoose.model('Video', videoSchema);
