var Laptop = require('../models/laptop');
var Category = require('../models/category_list');
const { body, validationResult } = require('express-validator');
var async = require('async');

//Display list of all laptops
exports.laptop_list = function (req, res, next) {
  Laptop.find()
    .populate('laptop')
    .exec(function (err, list_laptops) {
      if (err) {
        return next(err);
      }
      //if successful, then render
      res.render('laptop_list', {
        title: 'Laptop list',
        laptop_list: list_laptops,
      });
    });
};

//display details for specific laptop
exports.laptop_detail = function (req, res, next) {
  Laptop.findById(req.params.id)
    .populate('laptop')
    .exec(function (err, laptop) {
      if (err) {
        return next(err);
      }
      if (laptop == null) {
        var err = new Error('Laptop not found');
        err.status = 404;
        return next(err);
      }
      //if successfully found
      res.render('laptop_detail', { laptop: laptop });
    });
};

//display laptop create form on GET
exports.laptop_create_get = function (req, res) {
  Category.find({ name: 'Laptops' }).then((category) => {
    res.render('laptop_form', {
      title: 'Create Laptop',
      category: category,
    });
  });
};

//handle laptop create form on POST
exports.laptop_create_post = [
  body('name')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Name must be specified.'),
  body('description').trim(),
  body('price')
    .isNumeric()
    .withMessage('Entered a non number')
    .isFloat({ min: 1 }),
  body('stock')
    .isNumeric()
    .withMessage('Entered a non number')
    .isFloat({ min: 1 }),

  //process request after validation and sanitization
  (req, res, next) => {
    //get errors from validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      //IF there are errors, rerender the form with error messages
      res.render('laptop_form', {
        title: 'Create Laptop',
        laptop: req.body,
        errors: errors.array(),
      });
    } else {
      //if form data is valid
      //create new instance of laptop

      var laptop = new Laptop({
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        price: req.body.price,
        stock: req.body.stock,
      });

      //save this new instance inside the database
      laptop.save(function (err) {
        if (err) {
          return next(err);
        }
        console.log('New Laptop: ' + laptop);
        res.redirect(laptop.url);
      });
    }
  },
];

//display laptop delete form on get
exports.laptop_delete_get = function (req, res, next) {
  Laptop.findById(req.params.id)
    .populate('laptop')
    .exec(function (err, laptop) {
      if (err) {
        return next(err);
      }
      if (laptop == null) {
        var err = new Error('Laptop not found');
        err.status = 404;
        return next(err);
      }
      //if successfully found
      res.render('laptop_delete', { laptop: laptop });
    });
};

//handle laptop delete form on POST
exports.laptop_delete_post = function (req, res, next) {
  Laptop.findById(req.body.laptopId)
    .populate('laptop')
    .exec(function (err, laptop) {
      if (err) {
        return next(err);
      }
      if (laptop === null) {
        var err = new Error('Laptop not found');
        err.status = 404;
        return next(err);
      }
      //if successfully found, delete
      Laptop.findByIdAndRemove(req.body.laptopId, function deleteLaptop(err) {
        if (err) {
          return next(err);
        }
        //success, go to laptop list
        res.redirect('/catalog/laptops');
      });
    });
};

//handle laptop update form on GET
exports.laptop_update_get = function (req, res, next) {
  async.parallel(
    {
      laptop: function (callback) {
        Laptop.findById(req.params.id).populate('laptop').exec(callback);
      },
      category: function (callback) {
        Category.find({ name: 'Laptops' }).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.laptop === null) {
        var err = new Error('Laptop not found');
        err.status = 404;
        return next(err);
      }
      //success
      res.render('laptop_form', {
        title: 'Update Laptop',
        laptop: results.laptop,
        category: results.category,
      });
    }
  );
};

//handle laptop update form on POST
exports.laptop_update_post = [
  //validate and sanitise fields
  body('name')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Name must be specified.'),
  body('description').trim(),
  body('price')
    .isNumeric()
    .withMessage('Entered a non number')
    .isFloat({ min: 1 }),
  body('stock')
    .isNumeric()
    .withMessage('Entered a non number')
    .isFloat({ min: 1 }),

  //process request after validation and sanitization
  (req, res, next) => {
    //extract validation errors from request
    const errors = validationResult(req);

    //create laptop object with new data
    var laptop = new Laptop({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      stock: req.body.stock,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      //there are errors, rerender form with error messages

      //get all laptops and category for form
      async.parallel(
        {
          laptop: function (callback) {
            Laptop.findById(req.params.id).populate('laptop').exec(callback);
          },
          category: function (callback) {
            Category.find({ name: 'Laptops' }).exec(callback);
          },
        },
        function (err, results) {
          if (err) {
            return next(err);
          }
          res.render('laptop_form', {
            title: 'Update Laptop',
            laptop: results.laptop,
            category: results.category,
            errors: errors.array(),
          });
        }
      );
      return;
    } else {
      //data is valid, update the db
      Laptop.findByIdAndUpdate(req.params.id, laptop, {}, function (
        err,
        laptop
      ) {
        if (err) {
          return next(err);
        }
        //successfully redirect to laptop page
        res.redirect(laptop.url);
      });
    }
  },
];
