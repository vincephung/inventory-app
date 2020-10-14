var Category = require('../models/category_list');
var async = require('async');

//index page that shows all of the categories
exports.index = (req, res) => {
  res.render('index', { title: 'Inventory App' });
};
