const db = require('../util/database');
const Cart = require('./cart');


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
      return db.execute(`INSERT INTO products(
        prod_name,
        prod_tags,
        prod_description,
        prod_price,
        prod_imageUrl)
        VALUES(?, ?, ?, ?, ?)`,[this.prod_name, this.prod_tags, this.prod_description, this.prod_price, this.prod_imageUrl]);
  };

  static deleteById(id){


  };

  static fetchAll() {
    return db.execute(`SELECT * FROM products`);
  };

  static findById(id){
    return db.execute(`SELECT * FROM products WHERE prod_id = ?`,[id])
  };



};
