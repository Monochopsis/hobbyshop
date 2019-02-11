// const HobbyShopController = require('./controllers/HobbyShopController')

// require express function
const express = require('express');
//require handlebars function
const exphbs = require('express-handlebars');
//require body-parser
const bodyParser = require('body-parser');
// require path function
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');

const errorController = require('./controllers/error');
const User = require('./models/user');

const MONGODB_URI = 'mongodb+srv://tine:tine@hobbyshop-teksk.azure.mongodb.net/hobbyshop';

// initialize a new name for express
const app = express();
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions',
  });
const csrfProtection = csrf({});




app.engine('handlebars', exphbs({
    layoutsDir: 'views/layouts/',
    partialsDir:'views/partials/',
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '/views'));


// const adminData = require('./routes/admin');
const clientRoutes = require('./routes/client');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');



// static files middleware path (css,image, javscript)
app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
    session({
      secret: 'my secret',
      resave: false,
      saveUninitialized: false,
      store: store
    })
  );
  app.use(csrfProtection);

app.use((req, res, next) => {
    if (!req.session.user) {
      return next();
    }
    User.findById(req.session.user._id)
      .then(user => {
        req.user = user;
        next();
      })
      .catch(err => console.log(err));
});

app.use((req, res, next) =>{
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use(csrfProtection);

// app.use('/admin', adminData.routes);
app.use('/client', clientRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404Page);


mongoose
    .connect(MONGODB_URI)
    .then(result =>{
      console.log('Connected!')
      app.listen(3000);
    })
    .catch(err =>{
        console.log(err)
    })