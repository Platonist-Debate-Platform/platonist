const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

const pathToEnvFile = path.resolve(
  process.cwd(),
  `${process.env.NODE_ENV || ''}.env`,
);

if (fs.existsSync(pathToEnvFile)) {
  dotenv.config({
    path: pathToEnvFile,
  });
}

const isStaging = process.env.NODE_ENV === 'staging' ? true : false;

module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', isStaging ? 1338 : 1337),
  admin: {
    auth: {
      secret: env('ADMIN_JWT_SECRET', '672945d63b44676fda6b268275a1cfdd'),
    },
  },
});
