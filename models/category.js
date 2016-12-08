'use strict';

const mongoose = require('mongoose');

let categorySchema = mongoose.Schema({
  name: {type: String}
});


module.exports = mongoose.model('Category', categorySchema);
