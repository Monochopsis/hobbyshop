const Product = require('../models/product')

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
    req.user.createProduct({
        name: name,
        tags: tags,
        description: description,
        price: price,
        imageUrl: imageUrl,
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
    const id = req.params.id;
    req.user.getProducts({where: {id: id}})
    // Product.findById(id)
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
    const id = req.body.id;
    const updatedname = req.body.name;
    const updatedtags = req.body.tags;
    const updateddescription = req.body.description;
    const updatedprice = req.body.price;
    const updatedimageUrl = req.body.imageUrl;
    Product.findById(id)
    .then(product =>{
        product.name = updatedname,
        product.tags = updatedtags,
        product.description = updateddescription,
        product.price = updatedprice,
        product.imageUrl = updatedimageUrl
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
    const id = req.body.id;
    Product.findById(id).then(product =>{
        return product.destroy();
    })
    .then(result =>{
        console.log('DESTROYED PRODUCT!')
        res.redirect('/client/c-products');
    })
    .catch(err => console.log(err))

};