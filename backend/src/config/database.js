/**
 * Configuração da ligação à base de dados PostgreSQL via Sequelize.
 *
 * Responsável por:
 * - Criar a instância Sequelize com as credenciais do .env.
 * - Ativar SSL apenas em ambientes remotos (Neon).
 * - Definir convenções globais dos modelos (timestamps, snake_case, soft-delete).
 */

var Sequelize = require('sequelize');
require('dotenv').config();

// Em localhost não se usa SSL; em produção (Neon) é obrigatório.
const isLocalhost = process.env.DB_HOST === 'localhost';

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'postgres',
        port: process.env.DB_PORT,
        // Alterar para console.log para depurar queries SQL no terminal.
        logging: false,

        // SSL obrigatório para o Neon (BD remota); dispensado em localhost.
        dialectOptions: isLocalhost ? {} : {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        },
        
        define: {
            timestamps: true,
            // Converte camelCase para snake_case nas colunas (ex: createdAt → created_at).
            underscored: true,
            // Ativa soft-delete: regista deleted_at em vez de apagar fisicamente.
            paranoid: true
        }
    }
);
module.exports = sequelize;