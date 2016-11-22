'use strict';

const express = require('express');
const router = express.Router();
const Video = require('../models/video');


//for users only
router.route("/upload")
  .get(ensureAuthenticated, (req, res) => {
    res.render('user/upload');
  })
  .post(ensureAuthenticated, (req, res) => {
    new Video(req.body).save((e) => {
      if(e) throw e;

      console.log('Video uploaded');
    });
  });


function ensureAuthenticated (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/users/login');
  }
};



module.exports = router;
