import { defineConfig } from 'umi';
// import theme from '../src/styles/theme';
import routes from '../src/routes';

export default defineConfig({
  title: 'basf',
  favicon: '/favicon.ico',
  history: { type: 'hash' },
  // theme: theme.lessVars,
  nodeModulesTransform: {
    type: 'none',
  },
  routes,
  fastRefresh: {},
  devServer: {
    port: 8080,
  },
  define: {
    'process.env': process.env,
  },
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
    },
  },
  hash: true,
  mfsu: {},
});
