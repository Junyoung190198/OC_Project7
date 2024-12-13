const express = require('express');
const router = express.Router();
const employeeAccountCtrl = require('../controllers/employeeAccount');

// employee account logic routes loading controllers
router.post('/signup', employeeAccountCtrl.signup);
router.post('/login', employeeAccountCtrl.login);


module.exports = router;
