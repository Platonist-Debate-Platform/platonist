module.exports = ({ env }) => ({
  defaultConnection: 'default',
  connections: {
    default: {
      connector: 'bookshelf',
      settings: {
        client: 'mysql',
        host: '0.0.0.0',
        port: 3306,
        username: 'root',
        password: 'password',
        database: 'platonist_staging',
        charset: 'utf8mb4',
      },
      options: {
        useNullAsDefault: true,
      },
    },
  },
});
