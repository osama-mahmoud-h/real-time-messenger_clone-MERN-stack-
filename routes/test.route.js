const express = require('express');
const router = express.Router();

///controllers
const{
test
} = require('../controller/test.controller');

router.route('/create').post((req,res,next)=>{
    test(req,res,next);
});
//router.route('/login').post();

module.exports = router;
