module.exports = ({ env }) => ({
  defaultConnection: 'default',
  connections: {
    default: {
      connector: 'bookshelf',
      settings: {
        client: 'mysql',
        host: env('DB_HOST', '0.0.0.0'),
        port: env.int('DB_PORT', 3306),
        username: env('DB_USER'),
        password: env('DB_PASSWORD'),
        database: env('DB_NAME'),
        charset: env('DB_CHARSET', 'utf8mb4'),
      },
      options: {
        useNullAsDefault: true,
      },
    },
  },
});
