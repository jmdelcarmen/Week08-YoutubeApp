'use strict';

const express = require('express');
const router = express.Router();
const Video = require('../models/video');


router.post('/upload', (req, res, next) => {
  console.log(req.body);
})

module.exports = router;
