
const Product = require('../models/product');


exports.getAddProduct = (req, res, next) => {
    res.render('client/edit-product', {
        pageTitle: 'Add Product',
        path: 'client/add-product',
        editing: false,
    });
};

exports.postAddProduct = (req, res, next) => {
    const name = req.body.name;
    const tags = req.body.tags;
    const description = req.body.description;
    const price= req.body.price;
    const imageUrl = req.body.imageUrl;
    const product = new Product(name, tags, description, price, imageUrl);
    product
    .save()
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
    const id = req.params.id;
    Product.findById(id)
    .then(product =>{
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
    const id = req.body.id;
    const updatedname = req.body.name;
    const updatedtags = req.body.tags;
    const updateddescription = req.body.description;
    const updatedprice = req.body.price;
    const updatedimageUrl = req.body.imageUrl;
        const product = new Product(
            updatedname,
            updatedtags,
            updateddescription,
            updatedprice,
            updatedimageUrl,
            id
        )
        return product.save()
        .then(() =>{
        console.log('UPDATED PRODUCT');
        res.redirect('/client/c-products');
    })
    .catch(err => console.log(err))

};

exports.getMyProduct = (req, res,next) =>{
    Product.fetchAll()
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
    const id = req.body.id;
    Product.deleteById(id)
    .then(() =>{
        console.log('DESTROYED PRODUCT!')
        res.redirect('/client/c-products');
    })
    .catch(err => console.log(err))

};