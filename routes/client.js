const path = require('path');

const express = require('express');

const clientController = require('../controllers/client')
const isAuth = require('../middleware/is-auth');


const router = express.Router();



// /client/add-product => GET
router.get('/add-product', isAuth, clientController.getAddProduct);

// /client/c-product => GET
router.get('/c-products', isAuth, clientController.getMyProduct);

// /client/a-products => POST
router.post('/add-product', isAuth, clientController.postAddProduct);

// /client/edit-product => GET
router.get('/edit-product/:id', isAuth, clientController.getEditProduct);

// /client/edit-product => POST
router.post('/edit-product', isAuth, clientController.postEditProduct);

// /client/delete-product => POST
router.post('/delete-product', isAuth, clientController.postDeleteProduct);

module.exports = router;

