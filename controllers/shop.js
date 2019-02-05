const Product = require('../models/product')
const Cart = require('../models/cart')

  exports.getProducts = (req, res, next)=>{
    Product.findAll().then(products =>{
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
    const prod_id = req.params.prod_id;
    // Product.findAll({where: {prod_id: prod_id}})
    // .then(products =>{
    //     res.render('shop/details', {
    //         product: products[0],
    //         pageTitle: 'Details',
    //         path: '/products'
    //     });

    // })
    // .catch(err => console.log(err))
    Product.findById(prod_id)
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
    Cart.getCart(cart =>{
        Product.fetchAll(products =>{
            const cartProducts = [];
            for (product of products){
                const cartProductData = cart.products.find(prod => prod.prod_id === product.prod_id)
                if(cart.products.find(prod => prod.prod_id === product.prod_id)){
                    cartProducts.push({productData: product, qty: cartProductData.qty});
                }
            }

            // console.log(products)

            res.render('shop/cart',{
                pageTitle: 'Your Cart',
                path: '/cart',
                products: cartProducts
                });
        });
    })
};
exports.postCart = (req, res, next) =>{
    const prod_id = req.body.prod_id;
    Product.findById(prod_id, (product) =>{
        Cart.addProduct(prod_id, product.prod_price)
    });
    res.redirect('/cart')
};

exports.postCartDeleteProduct = (req, res, next) =>{
    const prod_id = req.body.prod_id;
    Product.findById(prod_id, product =>{
        Cart.deleteProduct(prod_id, product.prod_price);
        res.redirect("/cart");
    })
}

exports.getCheckout = (req,res,next)=>{
    res.render('shop/checkout',{
        pageTitle: 'Checkout',
        path: '/checkout',
    });
};

exports.getOrders = (req,res,next)=>{
    res.render('shop/orders',{
        pageTitle: 'Your Orders',
        path: '/orders'
    })
}

