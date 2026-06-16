const express = require("express");
const cors = require('cors');
require('dotenv').config();

const db = require('./src/models');
const path = require('path');
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const companyRoutes = require('./src/routes/companiesRoutes');
const roleRoutes = require('./src/routes/roleRoutes');
const assetRoutes = require('./src/routes/assetRoutes');
const permissionRoutes = require('./src/routes/permissionRoutes');
const incidentRoutes = require('./src/routes/incidentRoutes');
const documentRoutes = require('./src/routes/documentRoutes');
const ticketRoutes = require('./src/routes/ticketRoutes');
const articleRoutes = require('./src/routes/articleRoutes');
const categoryRoutes = require('./src/routes/categoryRoutes');
const chatRoutes = require('./src/routes/chatRoutes');
const auditLogRoutes = require('./src/routes/auditLogRoutes');
const reportRoutes = require('./src/routes/reportRoutes');
const dashboardRoutes = require('./src/routes/dashboardRoutes');

const app = express();

// TRUST PROXY (para obter IP real do cliente, especialmente atrás de proxies ou em produção)
app.set('trust proxy', 1);

// --- MIDDLEWARES ---
app.use(cors()); 
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true })); 

// --- API ROUTES ---
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/permissions', permissionRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/audit-logs', auditLogRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/dashboard', dashboardRoutes);

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