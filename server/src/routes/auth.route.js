const express = require('express');
const router = express.Router();

///controllers
const{
register,
login,
logout,
userInfo
} = require('../controllers/auth.controller');

//middlewares
const {verfiyUserAuth} = require('../middlewares/verfiyUserAuth');

router.route('/register').post((req,res,next)=>{
    register(req,res,next);
});
router.route('/login').post((req,res,next)=>{
    login(req,res,next);
});

router.route('/logout').get((req,res,next)=>{
    logout(req,res,next);
});

router.route('/isAuth').get((req,res,next)=>{
    verfiyUserAuth(req,res,next)
   }, userInfo);

module.exports = router;
