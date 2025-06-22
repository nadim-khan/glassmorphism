require('dotenv').config();

const envVars = process.env;

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.SERVER_PORT,
  socketOrigin: envVars.SOCKET_ORIGIN,
  mongo: {
    DB_USER: envVars.DB_USER,
    DB_KEY: envVars.DB_KEY,
    DB_Name: envVars.DB_Name,
    port: envVars.MONGO_PORT,
    isDebug: envVars.MONGOOSE_DEBUG
  },
  jwtsecret: envVars.JWT_SECRET
};