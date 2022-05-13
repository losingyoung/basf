import Koa from 'koa';
import koaBody from 'koa-body';
import serve from 'koa-static';
import compose from 'koa-compose';
import path from 'path';
import {router} from './router';
// import { swaggerMiddleware } from "./middleware/swagger";
import {unionResMiddleware} from './middlewares/unionRes';
import {errorMiddleware} from "./middlewares/error"
import { authMiddleware } from "./middlewares/auth";
// import {logStart, logEnd} from './utils/logger'

const app = new Koa();

// app.context.logStart = logStart
// app.context.logEnd = logEnd
const middlewares = compose([unionResMiddleware(), errorMiddleware(), authMiddleware()])
app.use(middlewares)
app.use(serve(path.resolve(__dirname, 'static')));
app.use(koaBody());

router.prefix('/api')
app.use(router.routes());
app.use(router.allowedMethods());

export default app;
