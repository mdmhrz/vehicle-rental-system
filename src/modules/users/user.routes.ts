import { Router } from 'express'
import { userControllers } from './user.controller';
import auth from '../../middleware/auth';

const router = Router();


router.get('/', auth('admin'), userControllers.getUser);
router.put('/:userId', userControllers.updateUser);
router.delete('/:userId', userControllers.deleteUser)



export const userRoutes = router;