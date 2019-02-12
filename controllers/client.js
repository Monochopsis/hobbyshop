
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
    const image = req.file;
    if(!image){
        return res.redirect('Error!')
    }
    const imageUrl = image.path;
    const product = new Product({
        name: name,
        tags: tags,
        description: description,
        price: price,
        imageUrl: imageUrl,
        userId: req.user
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
    const image = req.file;

    Product.findById(id)
        .then(product =>{
            if(product.userId.toString() !== req.user._id.toString()){
                return res.redirect('/')
            }
            product.name = updatedName;
            product.tags = updatedTags;
            product.description = updatedDescription;
            product.price = updatedPrice;
            if(image){
                product.imageUrl = image.path;
            }
            
            return product.save()
            .then(() =>{
                console.log('UPDATED PRODUCT');
                res.redirect('/client/c-products');
            });
        })
        .catch(err => console.log(err))
    };

exports.getMyProduct = (req, res,next) =>{
    Product.find({userId: req.user._id})
    // .select('title price -_id')
    // .populate('userId', 'name')
    .then(products =>{
        console.log(products)
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
    Product.deleteOne({_id: id, userId: req.user._id})
    .then(() =>{
        console.log('DESTROYED PRODUCT!')
        res.redirect('/client/c-products');
    })
    .catch(err => console.log(err))

};