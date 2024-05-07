const express = require('express');
const {
    requireSignIn,
    registerController,
    loginController,
    updateController,
    updateProfilePic
} = require('../controllers/userController');


//router object
const router = express.Router();


//routes
//Register || post
router.post('/register', registerController);

//Login || post
router.post('/login', loginController);

//update profile picture
router.put('/profile-pic', updateProfilePic);

//Update || put
router.put('/update-user', requireSignIn, updateController);

//exports
module.exports = router;