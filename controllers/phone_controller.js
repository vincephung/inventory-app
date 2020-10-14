var Phone = require('../models/phone');
var Category = require('../models/category_list');
const { body, validationResult } = require('express-validator');
var async = require('async');

//Display list of all phones
exports.phone_list = function (req, res, next) {
  Phone.find()
    .populate('phone')
    .exec(function (err, list_phones) {
      if (err) {
        return next(err);
      }
      //if successful, then render
      res.render('phone_list', {
        title: 'Phone list',
        phone_list: list_phones,
      });
    });
};

//display details for specific phone
exports.phone_detail = function (req, res, next) {
  Phone.findById(req.params.id, function (err, phone) {
    if (err) {
      return next(err);
    }
    if (phone === null) {
      var err = new Error('phone not found');
      err.status = 404;
      return next(err);
    }
    // if successfuly found phone id
    res.render('phone_detail', { phone: phone });
  });
};

//display phone create form on GET
exports.phone_create_get = function (req, res) {
  Category.find({ name: 'Phones' }).then((category) => {
    res.render('phone_form', {
      title: 'Create phone',
      category: category,
    });
  });
};

//handle phone create form on POST
exports.phone_create_post = [
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
      res.render('phone_form', {
        title: 'Create Phone',
        phone: req.body,
        errors: errors.array(),
      });
    } else {
      //if form data is valid
      //create new instance of phone

      var phone = new Phone({
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        price: req.body.price,
        stock: req.body.stock,
      });

      //save this new instance inside the database
      phone.save(function (err) {
        if (err) {
          return next(err);
        }
        console.log('New phone: ' + phone);
        res.redirect(phone.url);
      });
    }
  },
];

//display phone delete form on get
exports.phone_delete_get = function (req, res, next) {
  Phone.findById(req.params.id)
    .populate('phone')
    .exec(function (err, phone) {
      if (err) {
        return next(err);
      }
      if (phone == null) {
        var err = new Error('phone not found');
        err.status = 404;
        return next(err);
      }
      //if successfully found
      res.render('phone_delete', { phone: phone });
    });
};

//handle phone delete form on POST
exports.phone_delete_post = function (req, res, next) {
  Phone.findById(req.body.phoneId)
    .populate('phone')
    .exec(function (err, phone) {
      if (err) {
        return next(err);
      }
      if (phone === null) {
        var err = new Error('phone not found');
        err.status = 404;
        return next(err);
      }
      //if successfully found, delete
      Phone.findByIdAndRemove(req.body.phoneId, function deletephone(err) {
        if (err) {
          return next(err);
        }
        //success, go to phone list
        res.redirect('/catalog/phones');
      });
    });
};

//handle phone update form on GET
exports.phone_update_get = function (req, res, next) {
  async.parallel(
    {
      phone: function (callback) {
        Phone.findById(req.params.id).populate('phone').exec(callback);
      },
      category: function (callback) {
        Category.find({ name: 'Phones' }).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.phone === null) {
        var err = new Error('phone not found');
        err.status = 404;
        return next(err);
      }
      //success
      res.render('phone_form', {
        title: 'Update Phone',
        phone: results.phone,
        category: results.category,
      });
    }
  );
};

//handle phone update form on POST
exports.phone_update_post = [
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

    //create phone object with new data
    var phone = new Phone({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      stock: req.body.stock,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      //there are errors, rerender form with error messages

      //get all phones and category for form
      async.parallel(
        {
          phone: function (callback) {
            Phone.findById(req.params.id).populate('phone').exec(callback);
          },
          category: function (callback) {
            Category.find({ name: 'Phones' }).exec(callback);
          },
        },
        function (err, results) {
          if (err) {
            return next(err);
          }
          res.render('phone_form', {
            title: 'Update phone',
            phone: results.phone,
            category: results.category,
            errors: errors.array(),
          });
        }
      );
      return;
    } else {
      //data is valid, update the db
      Phone.findByIdAndUpdate(req.params.id, phone, {}, function (err, phone) {
        if (err) {
          return next(err);
        }
        //successfully redirect to phone page
        res.redirect(phone.url);
      });
    }
  },
];
