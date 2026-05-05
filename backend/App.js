const express = require("express");
const cors = require('cors');
require('dotenv').config();

const db = require('./src/models');
const app = express();

// --- MIDDLEWARES ---
app.use(cors()); 
app.use(express.json()); 

// --- Test ---
app.get('/', (req, res) => {
    res.json({ message: 'Bem-vindo à API da ProjectBox!' });
});

// --- DB conexion ---
const PORT = process.env.PORT || 5000;

db.sequelize.sync({ alter: true })
    .then(() => {
        console.log('✅ DB synchronized successfully!');
        app.listen(PORT, () => {
            console.log(`🚀 Server running: ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('❌ Fatal Error:', error);
    });