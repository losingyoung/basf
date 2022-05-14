import { initDB } from './model/index';
import app from './app';

const port = 3000;

initDB()
  .then(() => {
    app.listen(port, '0.0.0.0', () => {
      console.log('server listening ' + port);
    });
  })
  .catch((err: Error) => {
    console.log('init err', err);
  });
