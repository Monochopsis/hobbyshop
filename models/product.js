const fs = require('fs');
const path = require('path');

const Cart = require('./cart')

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'products.json'
);
const getProductsFromFile = cb => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {
  constructor(id, name, tags, description, price, imageUrl) {
    this.prod_id = id;
    this.prod_name = name;
    this.prod_tags = tags;
    this.prod_description = description;
    this.prod_price = price;
    this.prod_imageUrl = imageUrl;
  }

  save() {
    getProductsFromFile(products => {
      if(this.prod_id){
        const existingProductIndex = products.findIndex(prod => prod.prod_id === this.prod_id)
        const updatedProducts = [...products];
        updatedProducts[existingProductIndex] = this;
        fs.writeFile(p, JSON.stringify(updatedProducts), err => {
          console.log(err);
        });
      }else{
      this.prod_id = Math.random().toString();
      products.push(this);
      fs.writeFile(p, JSON.stringify(products), err => {
        console.log(err);
      });
    }
    });
  };

  static deleteById(id){
    getProductsFromFile(products => {
      const product = products.find(prod => prod.prod_id === id);
      const updatedProducts = products.filter(prod => prod.prod_id !== id);
      fs.writeFile(p, JSON.stringify(updatedProducts), err =>{
        if(!err){
          Cart.deleteProduct(id, product.price)
        }
      });
    });

  };

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }
  static findById(id,cb){
    getProductsFromFile(products => {
      const product = products.find(p => p.prod_id === id);
      cb(product);
    });
  };



};
