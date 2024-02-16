const express = require('express');
const {
    requireSignIn,
    registerController,
    loginController,
    updateController
} = require('../controllers/userController');


//router object
const router = express.Router();


//routes
//Register || post
router.post('/register', registerController);

//Login || post
router.post('/login', loginController);

//Update || put
router.put('/update-user', requireSignIn, updateController);

//exports
module.exports = router;