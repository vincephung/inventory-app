var Tablet = require('../models/tablet');
var Category = require('../models/category_list');
const { body, validationResult } = require('express-validator');
var async = require('async');

//Display list of all tablets
exports.tablet_list = function (req, res, next) {
  Tablet.find()
    .populate('tablet')
    .exec(function (err, list_tablets) {
      if (err) {
        return next(err);
      }
      //if successful, then render
      res.render('tablet_list', {
        title: 'Tablet list',
        tablet_list: list_tablets,
      });
    });
};

//display details for specific tablet
exports.tablet_detail = function (req, res, next) {
  Tablet.findById(req.params.id, function (err, tablet) {
    if (err) {
      return next(err);
    }
    if (tablet === null) {
      var err = new Error('tablet not found');
      err.status = 404;
      return next(err);
    }
    // if successfuly found tablet id
    res.render('tablet_detail', { tablet: tablet });
  });
};

//display tablet create form on GET
exports.tablet_create_get = function (req, res) {
  Category.find({ name: 'Tablets' }).then((category) => {
    res.render('tablet_form', {
      title: 'Create tablet',
      category: category,
    });
  });
};

//handle tablet create form on POST
exports.tablet_create_post = [
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
      res.render('tablet_form', {
        title: 'Create tablet',
        tablet: req.body,
        errors: errors.array(),
      });
    } else {
      //if form data is valid
      //create new instance of tablet

      var tablet = new Tablet({
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        price: req.body.price,
        stock: req.body.stock,
      });

      //save this new instance inside the database
      tablet.save(function (err) {
        if (err) {
          return next(err);
        }
        console.log('New tablet: ' + tablet);
        res.redirect(tablet.url);
      });
    }
  },
];

//display tablet delete form on get
exports.tablet_delete_get = function (req, res, next) {
  Tablet.findById(req.params.id)
    .populate('tablet')
    .exec(function (err, tablet) {
      if (err) {
        return next(err);
      }
      if (tablet == null) {
        var err = new Error('tablet not found');
        err.status = 404;
        return next(err);
      }
      //if successfully found
      res.render('tablet_delete', { tablet: tablet });
    });
};

//handle tablet delete form on POST
exports.tablet_delete_post = function (req, res, next) {
  Tablet.findById(req.body.tabletId)
    .populate('tablet')
    .exec(function (err, tablet) {
      if (err) {
        return next(err);
      }
      if (tablet === null) {
        var err = new Error('tablet not found');
        err.status = 404;
        return next(err);
      }
      //if successfully found, delete
      Tablet.findByIdAndRemove(req.body.tabletId, function deletetablet(err) {
        if (err) {
          return next(err);
        }
        //success, go to tablet list
        res.redirect('/catalog/tablets');
      });
    });
};

//handle tablet update form on GET
exports.tablet_update_get = function (req, res, next) {
  async.parallel(
    {
      tablet: function (callback) {
        Tablet.findById(req.params.id).populate('tablet').exec(callback);
      },
      category: function (callback) {
        Category.find({ name: 'Tablets' }).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.tablet === null) {
        var err = new Error('tablet not found');
        err.status = 404;
        return next(err);
      }
      //success
      res.render('tablet_form', {
        title: 'Update Tablet',
        tablet: results.tablet,
        category: results.category,
      });
    }
  );
};

//handle tablet update form on POST
exports.tablet_update_post = [
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

    //create tablet object with new data
    var tablet = new Tablet({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      stock: req.body.stock,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      //there are errors, rerender form with error messages

      //get all tablets and category for form
      async.parallel(
        {
          tablet: function (callback) {
            Tablet.findById(req.params.id).populate('tablet').exec(callback);
          },
          category: function (callback) {
            Category.find({ name: 'Tablets' }).exec(callback);
          },
        },
        function (err, results) {
          if (err) {
            return next(err);
          }
          res.render('tablet_form', {
            title: 'Update Tablet',
            tablet: results.tablet,
            category: results.category,
            errors: errors.array(),
          });
        }
      );
      return;
    } else {
      //data is valid, update the db
      Tablet.findByIdAndUpdate(req.params.id, tablet, {}, function (
        err,
        tablet
      ) {
        if (err) {
          return next(err);
        }
        //successfully redirect to tablet page
        res.redirect(tablet.url);
      });
    }
  },
];
