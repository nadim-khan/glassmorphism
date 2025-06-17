const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const userController = require('../controller/user');
const { authenticate, verifySession } = require('../middleware/auth');

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, '../../uploads')),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
  })
});

router.post('/', upload.single('profilePic'), userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/me/access-token', verifySession, userController.refreshAccessToken);
router.get('/', authenticate, userController.getAllUsers);
router.get('/:userId', authenticate, userController.getUserById);
router.patch('/:userId', authenticate, userController.updateUser);
router.delete('/:userId', authenticate, userController.deleteUser);

module.exports = router;
