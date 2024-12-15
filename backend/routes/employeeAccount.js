const express = require('express');
const router = express.Router();
const employeeAccountCtrl = require('../controllers/employeeAccount');

// employee account logic routes loading controllers
router.post('/signup', employeeAccountCtrl.signup);
router.post('/login', employeeAccountCtrl.login);
router.post('/refresh', employeeAccountCtrl.refreshToken);
router.post('/logout', employeeAccountCtrl.logout);


module.exports = router;
