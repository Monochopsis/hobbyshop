const Product = require('../models/product')


  exports.getProducts = (req, res, next)=>{
    Product.fetchAll()
    .then(products =>{
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
    // Product.findAll({where: {id: id}})
    // .then(products =>{
    //     res.render('shop/details', {
    //         product: products[0],
    //         pageTitle: 'Details',
    //         path: '/products'
    //     });

    // })
    // .catch(err => console.log(err))
    Product.findById(id)
    .then(product =>{
        res.render('shop/details', {
            product: product,
            pageTitle: 'Details',
            path: '/products'
        });
    })
    .catch(err => console.log(err))
};

exports.getIndex = (req,res,next) =>{
        res.render('shop/index', {
            pageTitle: 'Hobby Shop  ',
            path: '/index',
        });
};

exports.getCart = (req, res, next) =>{
    req.user
    .getCart()
    .then(products =>{
            res.render('shop/cart',{
                pageTitle: 'Your Cart',
                path: '/cart',
                products: products,
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
        return req.user.addToCart(product)
    }).then(result =>{
        console.log(result);
    })
    // let fetchedCart;
    // let newQuantity = 1;
    // req.user
    // .getCart()
    // .then(cart =>{
    //     fetchedCart = cart;
    //     return cart.getProducts({where: {id : prodId}});
    // })
    // .then(products =>{
    //     let product;
    //     if(products.length > 0){
    //         product = products[0]
    //     }
    //     if(product){
    //         const oldQuantity = product.cartItem.quantity;
    //         newQuantity = oldQuantity + 1;
    //         return product;
    //     }
    //     return Product.findById(prodId)
    // })
    // .then(product =>{
    //     return fetchedCart.addProduct(product, {
    //         through:{quantity: newQuantity
    //         }
    //     });
    // })
    // .then(() =>{
    //     res.redirect('/cart');
    // })
    // .catch(err => console.log(err))

};

exports.postCartDeleteProduct = (req, res, next) =>{
    const prodId = req.body.id;
    req.user
    .getCart()
    .then(cart =>{
        return cart.getProducts({where: {id:prodId}})
    })
    .then(products =>{
        const product = products[0];
        return product.cartItem.destroy()
    })
    .then(result =>{
        res.redirect('/cart');
    })
    .catch(err => console.log(err))
};

exports.postOrder = (req,res,next) => {
    let fetchedCart;
    req.user
    .getCart()
    .then(cart =>{
        fetchedCart = cart;
       return cart.getProducts();
    })
    .then(products =>{
        return req.user
        .createOrder()
        .then(order =>{
            return order.addProducts(
                products.map(product =>{
                product.orderItem = {quantity: product.cartItem.quantity};
                return product;
            }));
        })
        .then(result =>{
            return fetchedCart.setProducts(null);
        })
        .then(result =>{
            res.redirect('/orders')
        })
        .catch(err => console);
    })
    .catch(err => console.log(err))
};

// exports.getCheckout = (req,res,next)=>{
//     res.render('shop/checkout',{
//         pageTitle: 'Checkout',
//         path: '/checkout',
//     });
// };

exports.getOrders = (req,res,next)=>{
    req.user
    .getOrders({include: ['products']})
    .then(orders =>{
    //    console.log('Orders: ', JSON.stringify(orders));
        res.render('shop/orders',{
            pageTitle: 'Your Orders',
            path: '/orders',
            orders: orders
        })
    })
    .catch(err => console.log(err));
}

exports.loginUser = (req,res,next) =>{
    res.render('shop/login',{
        pageTitle: 'Login',
        path: '/login'
    })
}
exports.registerUser = (req,res,next) =>{
    res.render('shop/register',{
        pageTitle: 'Register',
        path: '/register'
    })
}

