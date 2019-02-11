
const Product = require('../models/product');


exports.getAddProduct = (req, res, next) => {
    res.render('client/edit-product', {
        pageTitle: 'Add Product',
        path: 'client/add-product',
        editing: false,
        isAuthenticated: req.session.isLoggedIn
    });
};

exports.postAddProduct = (req, res, next) => {
    const name = req.body.name;
    const tags = req.body.tags;
    const description = req.body.description;
    const price= req.body.price;
    const imageUrl = req.body.imageUrl;
    const product = new Product({
        name: name,
        tags: tags,
        description: description,
        price: price,
        imageUrl: imageUrl,
        userId: req.session.user
    });
    product
    .save()
    .then(result =>{
        // console.log(result);
        console.log('Created Product');
        return res.redirect('/');
    })
    .catch(err =>{
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
            product: product,
            isAuthenticated: req.session.isLoggedIn
        });
    })
    .catch(err => console.log(err))

};

exports.postEditProduct = (req, res, next)=>{
    const id = req.body.id;
    const updatedName = req.body.name;
    const updatedTags = req.body.tags;
    const updatedDescription = req.body.description;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;

    Product.findById(id)
        .then(product =>{
            product.name = updatedName;
            product.tags = updatedTags;
            product.description = updatedDescription;
            product.price = updatedPrice;
            product.imageUrl = updatedImageUrl
            return product.save()
        })
        .then(() =>{
            console.log('UPDATED PRODUCT');
            res.redirect('/client/c-products');
        })
        .catch(err => console.log(err))
    };

exports.getMyProduct = (req, res,next) =>{
    Product.find()
    // .select('title price -_id')
    // .populate('userId', 'name')
    .then(products =>{
        console.log(products)
        res.render('client/c-products', {
            pageTitle: 'All Products',
            path: 'client/c-products',
            prods:products,
            isAuthenticated: req.session.isLoggedIn
        });
    })
    .catch(err => console.log(err))
};


exports.postDeleteProduct = (req, res, next) =>{
    const id = req.body.id;
    Product.findByIdAndRemove(id)
    .then(() =>{
        console.log('DESTROYED PRODUCT!')
        res.redirect('/client/c-products');
    })
    .catch(err => console.log(err))

};