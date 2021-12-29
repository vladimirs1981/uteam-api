import express from 'express';
import userController from '../controllers/user';

const router = express.Router();

router.get('/users', userController.allUsers);

router.post('/user', userController.createUser);

export = router;
