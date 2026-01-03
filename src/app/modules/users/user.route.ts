import { Router } from 'express';
import { UserControllers } from './user.controller';

const userRoutes = Router();

userRoutes.post('/register', UserControllers.createUser);
userRoutes.get('/all-users', UserControllers.getAllUsers);

export { userRoutes };
