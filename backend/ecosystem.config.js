module.exports = {
    apps : [{
      name: "live-product",
      script: "./dist/server.js",
      env: {
        NODE_ENV: "production",
        cronServerIp: "localhost"
      },
      error_file: 'NULL',
      out_file: 'NULL',
      "node_args": "--max_old_space_size=8192"
    }]
  }
