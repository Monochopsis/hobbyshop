const path = require('path');

const express = require('express');

const shopController = require('../controllers/shop')
const isAuth = require('../middleware/is-auth')
const router = express.Router();



router.get('/', shopController.getIndex);
//route GET for products
router.get('/products', shopController.getProducts);

//route GET for products + id
// router.get('/products/delete', shopController.getProducts);

//route GET for products + id
router.get('/products/:id', shopController.getProduct);

// //route GET for products + id
// router.get('/details', shopController.getDetails);

//route GET for cart
router.get('/cart', isAuth, shopController.getCart);

//route POST for cart
router.post('/cart', isAuth, shopController.postCart);

//route POST for cart delete
router.post('/cart-delete-item', isAuth, shopController.postCartDeleteProduct);

//route POST for creating order
router.post('/create-order', isAuth, shopController.postOrder)

//route GET for orders
router.get('/orders', isAuth, shopController.getOrders);
// //route GET for checkout
// router.get('/checkout', shopController.getCheckout);



// router.get('/register', shopController.registerUser);

// //route GET for premium
// router.get('/premium',(req,res)=>{
//     res.render('premium',{
//         pageTitle: 'Premium'
//     });
// });

// //route GET for auction
// router.get('/auction',(req,res)=>{
//     res.render('auction',{
//         pageTitle: 'Auction',
//     });
// });

module.exports = router;