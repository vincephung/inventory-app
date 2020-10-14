const express = require('express');
const router = express.Router();

//Require controller modules
const category_list_controller = require('../controllers/category_list_controller');
const laptop_controller = require('../controllers/laptop_controller');
const phone_controller = require('../controllers/phone_controller');
const tablet_controller = require('../controllers/tablet_controller');

//ROUTES

//Get catalog homepage, shows list of all the categories
router.get('/', category_list_controller.index);

//laptop routgers

//Get request for creating a new laptop
router.get('/laptop/create', laptop_controller.laptop_create_get);

//Post request for creating laptop
router.post('/laptop/create', laptop_controller.laptop_create_post);

//get request for deleting laptop
router.get('/laptop/:id/delete', laptop_controller.laptop_delete_get);

//post request for deleting laptop
router.post('/laptop/:id/delete', laptop_controller.laptop_delete_post);

//get request to update laptop
router.get('/laptop/:id/update', laptop_controller.laptop_update_get);

//post request to update laptop
router.post('/laptop/:id/update', laptop_controller.laptop_update_post);

//get request for single laptop
router.get('/laptop/:id', laptop_controller.laptop_detail);

//GET request for list of laptops
router.get('/laptops', laptop_controller.laptop_list);

//phone router

//Get request for creating a new phone
router.get('/phone/create', phone_controller.phone_create_get);

//Post request for creating phone
router.post('/phone/create', phone_controller.phone_create_post);

//get request for deleting phone
router.get('/phone/:id/delete', phone_controller.phone_delete_get);

//post request for deleting phone
router.post('/phone/:id/delete', phone_controller.phone_delete_post);

//get request to update phone
router.get('/phone/:id/update', phone_controller.phone_update_get);

//post request to update phone
router.post('/phone/:id/update', phone_controller.phone_update_post);

//get request for single phone
router.get('/phone/:id', phone_controller.phone_detail);
//GET request for list of phones
router.get('/phones', phone_controller.phone_list);

//tablet requests
//Get request for creating a new tablet
router.get('/tablet/create', tablet_controller.tablet_create_get);

//Post request for creating tablet
router.post('/tablet/create', tablet_controller.tablet_create_post);

//get request for deleting tablet
router.get('/tablet/:id/delete', tablet_controller.tablet_delete_get);

//post request for deleting tablet
router.post('/tablet/:id/delete', tablet_controller.tablet_delete_post);

//get request to update tablet
router.get('/tablet/:id/update', tablet_controller.tablet_update_get);

//post request to update tablet
router.post('/tablet/:id/update', tablet_controller.tablet_update_post);

//get request for single tablet
router.get('/tablet/:id', tablet_controller.tablet_detail);
//GET request for list of Tablets
router.get('/tablets', tablet_controller.tablet_list);

module.exports = router;
