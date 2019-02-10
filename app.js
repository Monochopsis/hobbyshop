// const HobbyShopController = require('./controllers/HobbyShopController')

// require express function
const express = require('express');
//require handlebars function
const exphbs = require('express-handlebars');
//require body-parser
const bodyParser = require('body-parser');
// require path function
const path = require('path');

const errorController = require('./controllers/error');
const mongoConnect = require('./util/database').mongoConnect;


// initialize a new name for express
const app = express();

app.engine('handlebars', exphbs({
    layoutsDir: 'views/layouts/',
    partialsDir:'views/partials/',
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '/views'));


const adminData = require('./routes/admin');
const clientRoutes = require('./routes/client');
const shopRoutes = require('./routes/shop');



// static files middleware path (css,image, javscript)
app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) =>{
    // User.findById(1)
    // .then(user =>{
    //     req.user = user;
    //     next();
    // })
    // .catch(err => console.log(err))
    next();
});

app.use('/admin', adminData.routes);
app.use('/client', clientRoutes);
app.use(shopRoutes);

app.use(errorController.get404Page);


mongoConnect(() =>{
    app.listen(3000);
})