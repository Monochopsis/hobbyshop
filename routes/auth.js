const express = require('express');

const {body} = require('express-validator/check')

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login', authController.postLogin);

router.post(
    '/signup',
        body(
            'password', 'Invalid! Alphanumberic atleast 8 characters'
            )
        .isLength({min: 8})
        .isAlphanumeric(),

        body('confirmPassword').custom((value, {req}) =>{
            if(value !== req.body.password){
                throw new Error('Password have to match!')
            }
            return true;
        })

        ,authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token/:userId', authController.getNewPassword)

router.post('/new-password', authController.postNewPassword)
module.exports = router;