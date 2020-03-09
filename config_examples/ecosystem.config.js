module.exports = {
  apps : [{
    name: 'flowcontrol-ws-notifier',
    script: 'ws-server.js',

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    instances: 1,
    autorestart: true,
    watch: true,
    max_memory_restart: '512M',
    env: {
      NODE_ENV: 'development',
      WEBSOCKET_PORT: 7777,
      SERIAL_PORT: 'COM3',
      DEBUG: true,
    },
    env_production: {
      NODE_ENV: 'production',
      WEBSOCKET_PORT: 7777,
      SERIAL_PORT: '/dev/ttyUSB0',
      DEBUG: false,
      SPOILTIME: 6000,
    }
  }]
};

/* If static server needed add to apps array
{
  name: 'flowcontrol-static-server',
  script: 'static-server.js',
  instances: 1,
  autorestart: true,
  watch: true,
  max_memory_restart: '512M',
  env: {
    NODE_ENV: 'development',
    HTTP_PORT: 9696
  },
  env_production: {
    NODE_ENV: 'production',
    HTTP_PORT: 9696
  }
}
*/

//pm2 reload ecosystem.config.js --env production --only flowcontrol-ws-notifier
