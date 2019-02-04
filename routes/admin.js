const path = require('path');

const express = require('express');

const rootDir = require('../util/path');

const router = express.Router();

//route GET for register
router.get('/dashboard', (req,res)=>{
  res.render('dashboard',{pageTitle: 'dashboard'});
});

exports.routes = router;
