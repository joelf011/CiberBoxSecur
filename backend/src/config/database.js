var Sequelize = require('sequelize');
require('dotenv').config();
const isLocalhost = process.env.DB_HOST === 'localhost';

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'postgres',
        port: process.env.DB_PORT,
        logging: false, // change to console.log to show SQL on terminal

        // NEON -> SSl
        dialectOptions: isLocalhost ? {} : {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        },
        
        define: {
            timestamps: true, // createdAt & updatedAt
            underscored: true, // camelCase to snake_case (createdAt -> created_at)
            paranoid: true
        }
    }
);
module.exports = sequelize;