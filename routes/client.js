const path = require('path');

const express = require('express');

const clientController = require('../controllers/client')
const adminData = require('./admin');


const router = express.Router();



// /client/add-product => GET
router.get('/add-product', clientController.getAddProduct);

// /client/c-product => GET
router.get('/c-products', clientController.getMyProduct);

// /client/a-products => POST
router.post('/add-product', clientController.postAddProduct);

// /client/edit-product => GET
router.get('/edit-product/:id', clientController.getEditProduct);

// /client/edit-product => POST
router.post('/edit-product', clientController.postEditProduct);

// /client/delete-product => POST
router.post('/delete-product', clientController.postDeleteProduct);

module.exports = router;

