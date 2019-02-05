const path = require('path');

const express = require('express');

const shopController = require('../controllers/shop')


const router = express.Router();



router.get('/', shopController.getIndex);
//route GET for products
router.get('/products', shopController.getProducts);

//route GET for products + id
router.get('/products/delete', shopController.getProducts);

//route GET for products + id
router.get('/products/:prod_id', shopController.getProduct);

// //route GET for products + id
// router.get('/details', shopController.getDetails);

//route GET for card
router.get('/cart', shopController.getCart);

//route POST for cart
router.post('/cart', shopController.postCart);

//route POST for cart delete
router.post('/cart-delete-item', shopController.postCartDeleteProduct);
//route GET for checkout
router.get('/checkout', shopController.getCheckout);

//route GET for orders
router.get('/orders', shopController.getOrders);

router.get('/login', (req,res)=>{
    res.render('login', {pageTitle: 'Login'});
});
//route GET for register
router.get('/register', (req,res)=>{
    res.render('register',{pageTitle: 'Register'});
});
//route GET for premium
router.get('/premium',(req,res)=>{
    res.render('premium',{
        pageTitle: 'Premium'
    });
});

//route GET for auction
router.get('/auction',(req,res)=>{
    res.render('auction',{
        pageTitle: 'Auction',
    });
});

module.exports = router;