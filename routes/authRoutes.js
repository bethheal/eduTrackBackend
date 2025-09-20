import { Router } from 'express'
import {adminRegister, login} from '../controller/authController.js';

const router = Router();

router.post('/adminRegister', adminRegister),
router.post('/login', login)
export default router;