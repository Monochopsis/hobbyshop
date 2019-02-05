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
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user')
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
    User.findById(1)
    .then(user =>{
        req.user = user;
        next();
    })
    .catch(err => console.log(err))
});

app.use('/admin', adminData.routes);
app.use('/client', clientRoutes);
app.use(shopRoutes);

app.use(errorController.get404Page);

Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
User.hasMany(Product);

sequelize
    // .sync({force: true})
    .sync()
    .then(result =>{
        return User.findById(1);
        // console.log(result);
    })
    .then(user =>{
        if(!user){
            return User.create({
                firstName: 'Tine',
                lastName: 'Parayno',
                phoneNumber: 09454789123,
                email: 'Mono@gmail.com'
            })
        }
        return user;
    })
    .then(user =>{
        // console.log(user);
        const port = 3000;
        // listen to the server used by express
        app.listen(port,()=>{
            console.log(`Server no. running at port ${port}`);
        });
    })
    .catch(err =>{
        console.log(err);
});

