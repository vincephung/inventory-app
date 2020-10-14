#! /usr/bin/env node

console.log(
  'This script populates some laptops,phones and tablets to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0-mbdj7.mongodb.net/local_library?retryWrites=true'
);

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async');
var Laptop = require('./models/laptop');
var Phone = require('./models/phone');
var Tablet = require('./models/tablet');
var Category = require('./models/category_list');

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var categories = [];
var phones = [];
var laptops = [];
var tablets = [];

function categoryCreate(name, description, cb) {
  const category = new Category({
    name,
    description,
  });

  category.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Category: ' + category);
    categories.push(category);
    cb(null, category);
  });
}

function phoneCreate(name, description, category, price, stock, cb) {
  phonedetail = {
    name,
    description,
    category,
    price,
    stock,
  };

  var phone = new Phone(phonedetail);

  phone.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Phone: ' + phone);
    phones.push(phone);
    cb(null, phone);
  });
}

function laptopCreate(name, description, category, price, stock, cb) {
  laptopdetail = {
    name,
    description,
    category,
    price,
    stock,
  };

  var laptop = new Laptop(laptopdetail);

  laptop.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Laptop: ' + laptop);
    laptops.push(laptop);
    cb(null, laptop);
  });
}

function tabletCreate(name, description, category, price, stock, cb) {
  tabletdetail = {
    name,
    description,
    category,
    price,
    stock,
  };

  var tablet = new Tablet(tabletdetail);

  tablet.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Tablet: ' + tablet);
    tablets.push(tablet);
    cb(null, tablet);
  });
}

//create categories
function createCategories(cb) {
  async.series(
    [
      function (callback) {
        categoryCreate(
          'Phones',
          'Collection of the latest high tech smartphones',
          callback
        );
      },
      function (callback) {
        categoryCreate(
          'Laptops',
          'Modern laptops that range from low-end laptops for browsing to high end gaming laptops',
          callback
        );
      },
      function (callback) {
        categoryCreate(
          'Tablets',
          'A collection of tablets that are fast and easy to use.',
          callback
        );
      },
    ],
    // optional callback
    cb
  );
}

function createPhones(cb) {
  async.parallel(
    [
      function (callback) {
        phoneCreate(
          'iPhone 11',
          'The latest version of the classic iPhone. The screen size is 4.70" and it is operating on iOS 13',
          categories[0],
          130,
          15,
          callback
        );
      },
      function (callback) {
        phoneCreate(
          'Samsung Galaxy S10+',
          'The latest version of the classic Samsung Galaxy. The screen size is 5.0" and it is operating on Android',
          categories[0],
          170,
          25,
          callback
        );
      },
      function (callback) {
        phoneCreate(
          'iPhone 6',
          'An older version of the classic iPhone. The screen size is 4.10" and it is operating on iOS 13',
          categories[0],
          50,
          55,
          callback
        );
      },
      function (callback) {
        phoneCreate(
          'Google Pixel 4',
          'The latest version of the Google Pixel. The screen size is 4.50" and it is operating on Google 12',
          categories[0],
          200,
          9,
          callback
        );
      },
    ],
    // optional callback
    cb
  );
}

function createLaptops(cb) {
  async.parallel(
    [
      function (callback) {
        laptopCreate(
          'MacBook Pro',
          'The latest version of the classic Mac Laptop. The screen size is 13" and it is operating on iOS 13',
          categories[1],
          1000,
          15,
          callback
        );
      },
      function (callback) {
        laptopCreate(
          'Lenovo IdeaPad Flex',
          'Lenovo laptop that can be used as a tablet. The screen size is 15" and it is operating on Windows 10',
          categories[1],
          500,
          25,
          callback
        );
      },
      function (callback) {
        laptopCreate(
          'Acer Aspire 5',
          'Acers latest ultrabook laptop. The screen size is 15" and it is operating on Windows 10',
          categories[1],
          450,
          35,
          callback
        );
      },
      function (callback) {
        laptopCreate(
          'HP Envy 15.6',
          'HP Two in one laptop. The screen size is 13" and it is operating on Windows 10',
          categories[1],
          652,
          9,
          callback
        );
      },
    ],
    // optional callback
    cb
  );
}

function createTablets(cb) {
  async.parallel(
    [
      function (callback) {
        tabletCreate(
          'iPad Pro',
          'The latest version of the classic Apple tablet. The screen size is 10.1" and it is operating on iOS 13',
          categories[2],
          800,
          15,
          callback
        );
      },
      function (callback) {
        tabletCreate(
          'Samsung Galaxy 3 Tablet',
          'The latest version of the classic Samsung tablet. The screen size is 11.1" and it is operating on android 12',
          categories[2],
          500,
          25,
          callback
        );
      },
      function (callback) {
        tabletCreate(
          'Amazon fire 5',
          'The latest version of the classic Amazon Fire tablet. The screen size is 9" and it is operating on  amazon 12',
          categories[2],
          80,
          45,
          callback
        );
      },
      function (callback) {
        tabletCreate(
          'HP Tabby 12',
          'The latest version of the classic HP tablet. The screen size is 10.1" and it is operating on hp 9',
          categories[2],
          482,
          9,
          callback
        );
      },
    ],
    // optional callback
    cb
  );
}

async.series(
  [createCategories, createPhones, createLaptops, createTablets],
  // Optional callback
  function (err, results) {
    if (err) {
      console.log('FINAL ERR: ' + err);
    }
    // All done, disconnect from database
    mongoose.connection.close();
  }
);
