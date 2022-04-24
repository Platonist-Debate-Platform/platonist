module.exports = ({ env }) => ({
  defaultConnection: 'default',
  connections: {
    default: {
      connector: 'bookshelf',
      settings: {
        client: 'mysql',
        host: process.env.DB_HOST || '0.0.0.0',
        port: (process.env.DB_PORT && Number(process.env.DB_PORT)) || 3306,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        charset: 'utf8mb4',
      },
      options: {
        useNullAsDefault: true,
      },
    },
  },
});
