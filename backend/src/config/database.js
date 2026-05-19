var Sequelize = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'postgres',
        port: process.env.DB_PORT,
        logging: false, // change to console.log to show SQL on terminal
        define: {
            timestamps: true, // createdAt & updatedAt
            underscored: true, // camelCase to snake_case (creaetdAt -> created_at)
            paranoid: true
        }
    }
);
module.exports = sequelize;