const Product = require('../models/product')

exports.getAddProduct = (req, res, next) => {
    res.render('client/edit-product', {
        pageTitle: 'Add Product',
        path: 'client/add-product',
        editing: false,
    });
};

exports.postAddProduct = (req, res, next) => {
    const prod_name = req.body.prod_name;
    const prod_tags = req.body.prod_tags;
    const prod_description = req.body.prod_description;
    const prod_price= req.body.prod_price;
    const prod_imageUrl = req.body.prod_imageUrl;
    req.user.createProduct({
        prod_name: prod_name,
        prod_tags: prod_tags,
        prod_description: prod_description,
        prod_price: prod_price,
        prod_imageUrl: prod_imageUrl,
    })
    .then(result =>{
        // console.log(result);
        console.log('Created Product');
        return res.redirect('/');
    }).catch(err =>{
        console.log(err);
    })
  };

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if(!editMode){
        res.redirect('/');
    }
    const prod_id = req.params.prod_id;
    req.user.getProducts({where: {prod_id: prod_id}})
    // Product.findById(prod_id)
    .then(products =>{
        const product = products[0];
        if (!product) {
            return res.redirect('/');
          }
        res.render('client/edit-product', {
            pageTitle: 'Edit Product',
            path: 'client/edit-product',
            editing: editMode,
            product: product
        });
    })
    .catch(err => console.log(err))

};

exports.postEditProduct = (req, res, next)=>{
    const prod_id = req.body.prod_id;
    const updatedProd_name = req.body.prod_name;
    const updatedProd_tags = req.body.prod_tags;
    const updatedProd_description = req.body.prod_description;
    const updatedProd_price = req.body.prod_price;
    const updatedProd_imageUrl = req.body.prod_imageUrl;
    Product.findById(prod_id)
    .then(product =>{
        product.prod_name = updatedProd_name,
        product.prod_tags = updatedProd_tags,
        product.prod_description = updatedProd_description,
        product.prod_price = updatedProd_price,
        product.prod_imageUrl = updatedProd_imageUrl
        return product.save();
    })
    .then(result =>{
        console.log('UPDATED PRODUCT');
        res.redirect('/client/c-products');
    })
    .catch(err => console.log(err))

};

exports.getMyProduct = (req, res,next) =>{
    req.user
    .getProducts()
    .then(products =>{
        res.render('client/c-products', {
            pageTitle: 'All Products',
            path: 'client/c-products',
            prods:products,
        });
    })
    .catch(err => console.log(err))
};


exports.postDeleteProduct = (req, res, next) =>{
    const prod_id = req.body.prod_id;
    Product.findById(prod_id).then(product =>{
        return product.destroy();
    })
    .then(result =>{
        console.log('DESTROYED PRODUCT!')
        res.redirect('/client/c-products');
    })
    .catch(err => console.log(err))

};