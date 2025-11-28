module.exports = {
  apps: [{
    name: 'websolar-backend',
    script: 'server.js',
    cwd: 'C:\\www\\websolar\\backend',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: 'C:\\logs\\websolar-backend-error.log',
    out_file: 'C:\\logs\\websolar-backend-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    max_memory_restart: '1G',
    watch: false,
    ignore_watch: ['node_modules', 'logs', 'images']
  }]
}

