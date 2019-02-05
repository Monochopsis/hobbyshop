const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Product = sequelize.define('product', {
  prod_id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  prod_name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  prod_tags: {
    type: Sequelize.DOUBLE,
    allowNull: false
  },
  prod_description:  {
    type: Sequelize.STRING,
    allowNull: false
  },
  prod_price:  {
    type: Sequelize.DOUBLE,
    allowNull: false
  },
  prod_imageUrl:  {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = Product;