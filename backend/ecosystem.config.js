module.exports = {
  apps: [
    {
      name: 'basf-test',
      script: './dist/index.js',
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      watch_delay: 1000,
      error_file: 'NULL',
      out_file: 'NULL',
    },
    {
      name: 'basf',
      script: './dist/index.js',
      env: {
        NODE_ENV: 'production',
        PORT: 80
      },
      ignore_watch: ['node_modules', 'src'],
      error_file: 'NULL',
      out_file: 'NULL',
      node_args: '--max_old_space_size=8192',
    },
  ],
};
