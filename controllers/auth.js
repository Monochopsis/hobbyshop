const User = require('../models/user');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')
const crypto = require('crypto');
const {validationResult} = require('express-validator/check')
const transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key: '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'
  }
}))
exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      isAuthenticated: false,
    });
  };

exports.getSignup = (req,res, next) =>{
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: false,
    oldInput:{email: "", password: "" }
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({email:email})
    .then(user => {
      if (!user) {
        return res.redirect('/login');
      }
      bcrypt
        .compare(password, user.password)
        .then(doMatch => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(err => {
              console.log(err);
              res.redirect('/');
            });
          }
          res.redirect('/login');
        })
        .catch(err => {
          console.log(err);
          res.redirect('/login');
        });
    })
    .catch(err => console.log(err));
};


exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  // const confirmPassword = req.body.confirmPassword;

  const errors = validationResult(req);
  if(!errors.isEmpty()){
    console.log(errors.array());
    return res.status(422)
    .render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage: errors.array()[0].msg,
      oldInput: {email: email, password: password}
    });
  }
  User.findOne({ email: email })
    .then(userDoc => {
      if (userDoc) {
        return res.redirect('/signup');
      }
      return bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
          const user = new User({
            email: email,
            password: hashedPassword,
            cart: { items: [] }
          });
          return user.save();
        })
        .then(result => {
          res.redirect('/login');
          return transporter.sendMail({
            to: email,
            from:'hobby@shop.com',
            subject: 'Signup Succeeded!',
            html: '<h1>You successfully signed up!</h1>'
          })
          .catch(err =>{
            console.log(err)
          })

        });
    })
    .catch(err => {
      console.log(err);
    });
};


exports.postLogout = (req,res, next) =>{
  req.session.destroy(err =>{
      console.log(err);
      res.redirect('/');
  });
};

exports.getReset = (req, res, next) =>{
  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
  });
}

exports.postReset = (req, res, next) =>{
  crypto.randomBytes(32, (err,buffer) =>{
    if(err){
      console.log(err);
      return res.redirect('/reset');
    }
    const token = buffer.toString('hex');
    User.findOne({email: req.body.email})
    .then(user =>{
      if(!user){
        res.redirect('/reset')
      }
      user.resetToken = token;
      user.resetTokenExpiration = Date.now() + 3600000;
      return user.save();
    })
    .then(user =>{
      res.redirect('/');
      transporter.sendMail({
        to: req.body.email,
        from:'hobby@shop.com',
        subject: 'Password Reset!',
        html: `
          <p>You requested a password reset</p>
          <p>Click this <a href="http://localhost:3000/reset/${token}/${user._id}/">link</a> to set a new password.</p>
        `
      })

    })
    .catch(err => console.log(err))
  })

}

exports.getNewPassword = (req,res,next) =>{
  const token = req.param.token;
  const userId = req.param.userId;
  User.findOne({
    resetToken: token,
    resetTokenExpiration: {$gt: Date.now()}
  })
  .then(user =>{
    res.render('auth/new-password', {
      path: '/new-password',
      pageTitle: 'New Password',
      userId: userId,
      passwordToken: token
    });
  })
  .catch(err =>{
    console.log(err)
  })

}

exports.postNewPassword = (req,res,next)=>{
  const newPassword = req.body.newpassword;
  const userId = req.param.userId;
  const passwordToken = req.param.token;
  let resetUser;
  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId
  })
  .then(user =>{
    resetUser = user;
    return bcrypt.hash(newPassword, 12);
  })
  .then(hashedPassword => {
    console.log(resetUser.password)
    resetUser.password = hashedPassword;
    resetUser.resetToken = undefined;
    resetUser.resetTokenExpiration = undefined;
    return resetUser.save();
  })
  .then(result =>{
    res.redirect('/login');
    console.log("UPDATED!")
  })
  .catch(err =>{
    console.log(err)
  });

};