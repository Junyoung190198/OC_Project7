const express = require('express');
const router = express.Router();
const employeeAccountCtrl = require('../controllers/employeeAccount');
const authentification = require('../middleware/authentification');

// employee account logic routes loading controllers
router.post('/signup', employeeAccountCtrl.signup);
router.post('/login', employeeAccountCtrl.login);
router.post('/refresh', employeeAccountCtrl.refreshToken);
router.post('/logout', employeeAccountCtrl.logout);
router.post('/account/:id', authentification, employeeAccountCtrl.getAccount)
router.delete('/:id', authentification, employeeAccountCtrl.deleteAccount);
router.get('/dark-mode', authentification, employeeAccountCtrl.getDarkMode);
router.post('/dark-mode', authentification, employeeAccountCtrl.updateDarkMode);

module.exports = router;
