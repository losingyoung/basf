import Router from '@koa/router';
import * as UserService from '../controller/user'
const router = new Router();

router.post('/signup', UserService.signUp)
router.post('/signin', UserService.signIn)
export default router;
