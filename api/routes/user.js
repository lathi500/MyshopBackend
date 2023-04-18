const express = require('express');
const router = express.Router();

const userController = require('../controllers/userCont');

router.post('/signUp', userController.sign_up);

router.post('/login', userController.log_in);

router.delete('/:userId', userController.delete_UserData);

router.get('/', userController.get_all_userData);

module.exports = router; 
