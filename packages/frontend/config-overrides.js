const path = require('path');

module.exports = {
  webpack(config) {
    // config.resolve.alias = {
    //   ...config.resolve.alias,
    //   // react: path.resolve('node_modules/react'),
    //   // 'react-dom': path.resolve('node_modules/react-dom'),
    // };

    return config;
  },
};
