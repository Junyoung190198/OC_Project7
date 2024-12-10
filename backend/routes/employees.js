const express = require('express');
const router = express.Router();
const employeesCtrl = require('../controllers/employees');

// authentification logic routes loading controllers
router.post('/signup', employeesCtrl.signup);
router.post('/login', employeesCtrl.login);


module.exports = router;
