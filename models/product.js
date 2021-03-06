const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    tags: {
        type: String,
        required: false,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }

});

module.exports = mongoose.model('Product', productSchema)

// const mongodb = require('mongodb')
// const getDb = require('../util/database').getDb;
// class Product{
//     constructor(name, tags, description, price, imageUrl, id, userId){
//         this.name = name;
//         this.tags = tags;
//         this.description = description;
//         this.price = price;
//         this.imageUrl = imageUrl;
//         this._id = id ? new mongodb.ObjectId(id) : null;
//         this.userId = userId;
//     }
//     save(){
//         const db = getDb();
//         let dbOp;
//         if(this._id){
//             //Update the product
//             dbOp = db
//             .collection('products')
//             .updateOne(
//                 {_id: this._id},
//                 {$set: this}
//             )
//         } else{
//             dbOp = db
//             .collection('products')
//             .insertOne(this)

//         }
//         return dbOp
//             .then(result =>{
//                 console.log(result);
//             })
//             .catch(err => {
//                 console.log(err);
//             });
//     }

//     static fetchAll(){
//         const db = getDb();
//         return db
//         .collection('products')
//         .find()
//         .toArray()
//         .then(products =>{
//             console.log(products);
//             return products;
//         })
//         .catch(err =>{
//             console.log(err)
//         });
//     };

//     static findById(id){
//         const db = getDb();
//         return db.collection('products')
//         .find({_id: new mongodb.ObjectId(id)})
//         .next()
//         .then(product =>{
//             console.log(product);
//             return product;
//         })
//         .catch(err =>{
//             console.log(err)
//         });
//     }
//     static deleteById(id){
//         const db = getDb();
//         return db.collection('products').deleteOne({_id: new mongodb.ObjectId(id)})
//         .then(result =>{
//             console.log('Deleted!');
//         })
//         .catch(err =>{
//             console.log(err)
//         });
//     }
// };

// module.exports = Product;