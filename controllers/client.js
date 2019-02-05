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
    const prod_imageUrl = req.body.prod_imageUrl;
    const prod_description = req.body.prod_description;
    const prod_price= req.body.prod_price;
    const prod_tags = req.body.prod_tags
    const product = new Product(
        null,
        prod_name,
        prod_tags,
        prod_description,
        prod_price,
        prod_imageUrl,
    );
    product
    .save()
    .then(()=> {
        res.redirect('/');
    })
    .catch(err => console.log(err));
  };

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if(!editMode){
        res.redirect('/');
    }
    const prod_id = req.params.prod_id;
    Product.findById(prod_id, product =>{
        if (!product) {
            return res.redirect('/');
          }
        res.render('client/edit-product', {
            pageTitle: 'Edit Product',
            path: 'client/edit-product',
            editing: editMode,
            product: product
        });
    });

};

exports.postEditProduct = (req, res, next)=>{
    const prod_id = req.body.prod_id;
    const updatedProd_name = req.body.prod_name;
    const updatedProd_description = req.body.prod_description;
    const updatedProd_price = req.body.prod_price;
    const updatedProd_tags = req.body.prod_tags;
    const updatedProd_imageUrl = req.body.prod_imageUrl;
    const updatedProduct = new Product(
        prod_id,
        updatedProd_name,
        updatedProd_tags,
        updatedProd_description,
        updatedProd_price,
        updatedProd_imageUrl
        );
    updatedProduct.save();
    res.redirect('/client/c-products');
};

exports.getMyProduct = (req, res,next) =>{
    Product.fetchAll(products=> {
        res.render('client/c-products', {
            pageTitle: 'All Products',
            path: 'client/c-products',
            prods:products,
        });
    });
};

exports.postDeleteProduct = (req, res, next) =>{
    const prod_id = req.body.prod_id;
    Product.deleteById(prod_id);
    res.redirect('/client/c-products');
};