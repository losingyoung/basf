import Router from '@koa/router';
import * as FavoritesService from '../controller/favorites'
const router = new Router();

router.post('/update', FavoritesService.update)
export default router;
