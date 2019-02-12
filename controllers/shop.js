const Product = require('../models/product');
const Order = require('../models/order');


  exports.getProducts = (req, res, next)=>{
    Product.find()
    .then(products =>{
        console.log(products)
        res.render('shop/products', {
            prods: products,
            pageTitle: 'All Products',
            path: '/products',
        });
      }).catch(err =>{
          console.log(err)
    });
};

exports.getProduct = (req, res, next)=>{
    const id = req.params.id;
    Product.findById(id)
    .then(product =>{
        res.render('shop/details', {
            product: product,
            pageTitle: 'Details',
            path: '/products',
        });
    })
    .catch(err => console.log(err))
};

exports.getIndex = (req,res,next) =>{
        res.render('shop/index', {
            pageTitle: 'Hobby Shop  ',
            path: '/'
        });
};

exports.getCart = (req, res, next) =>{
    req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user =>{
        const products = user.cart.items;
            res.render('shop/cart',{
                pageTitle: 'Your Cart',
                path: '/cart',
                products: products,
                // csrfToken: req.csrfToken()
            });
    })
    .catch(err => console.log(err))
    // Cart.getCart(cart =>{
    //     Product.fetchAll(products =>{
    //         const cartProducts = [];
    //         for (product of products){
    //             const cartProductData = cart.products.find(prod => prod.id === product.id)
    //             if(cart.products.find(prod => prod.id === product.id)){
    //                 cartProducts.push({productData: product, qty: cartProductData.qty});
    //             }
    //         }

    //         // console.log(products)

    //         res.render('shop/cart',{
    //             pageTitle: 'Your Cart',
    //             path: '/cart',
    //             products: cartProducts
    //             });
    //     });
    // })
};

exports.postCart = (req, res, next) =>{
    const prodId = req.body.id;
    Product.findById(prodId).then(product =>{
        return req.user.addToCart(product);
    })
    .then(result =>{
        console.log(result);
        res.redirect('/cart');
    });
};

exports.postCartDeleteProduct = (req, res, next) =>{
    const prodId = req.body.id;
    req.user
    .removeFromCart(prodId)
    .then(result =>{
        res.redirect('/cart');
    })
    .catch(err => console.log(err))
};

exports.postOrder = (req,res,next) => {
    req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user =>{
        const products = user.cart.items.map(i =>{
            return {quantity: i.quantity, product: {...i.productId._doc}};
        });
        const order = new Order({
            user: {
                email: req.user.email,
                userId: req.user
            },
            products: products
        });
            return order.save();
        }).then(result =>{
            return req.user.clearCart();
        }).then(() =>{
            res.redirect('/orders')
        })
        .catch(err => console);
};
exports.getOrders = (req,res,next)=>{
    Order.find({"user.userId": req.user._id})
    .then(orders =>{
        res.render('shop/orders',{
            pageTitle: 'Your Orders',
            path: '/orders',
            orders: orders,
        })
    })
    .catch(err => console.log(err));
}

// exports.getCheckout = (req,res,next)=>{
//     res.render('shop/checkout',{
//         pageTitle: 'Checkout',
//         path: '/checkout',
//     });
// };
// exports.registerUser = (req,res,next) =>{
//     res.render('shop/register',{
//         pageTitle: 'Register',
//         path: '/register'
//     })
// }

