require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    dialectOptions: {
      // Se o host for local, não usa SSL. Se for o Neon, ativa o SSL automaticamente.
      ssl: process.env.DB_HOST === 'localhost' || process.env.DB_HOST === '127.0.0.1' 
        ? false 
        : { require: true, rejectUnauthorized: false }
    }
  }
};