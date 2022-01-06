import express from 'express';
import userController from '../controllers/user';

const router = express.Router();

router.get('/users', userController.allUsers);

router.post('/register', userController.registerUser);

router.post('/login', userController.loginUser);

export = router;
