/**
 * Ponto de entrada principal do backend (Express).
 *
 * Responsável por:
 * - Configurar middlewares globais (CORS, body-parser).
 * - Registar todas as rotas da API.
 * - Sincronizar os modelos Sequelize com a base de dados.
 * - Iniciar o servidor HTTP.
 *
 * Fluxo:
 * Pedido HTTP → Middlewares (CORS, JSON) → Router correspondente → Controller → BD → Resposta.
 */

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./src/models");
const path = require("path");

// --- Importação de rotas ---
const authRoutes = require("./src/routes/authRoutes");
const userRoutes = require("./src/routes/userRoutes");
const companyRoutes = require("./src/routes/companiesRoutes");
const roleRoutes = require("./src/routes/roleRoutes");
const assetRoutes = require("./src/routes/assetRoutes");
const permissionRoutes = require("./src/routes/permissionRoutes");
const incidentRoutes = require("./src/routes/incidentRoutes");
const documentRoutes = require("./src/routes/documentRoutes");
const ticketRoutes = require("./src/routes/ticketRoutes");
const articleRoutes = require("./src/routes/articleRoutes");
const categoryRoutes = require("./src/routes/categoryRoutes");
const chatRoutes = require("./src/routes/chatRoutes");
const auditLogRoutes = require("./src/routes/auditLogRoutes");
const reportRoutes = require("./src/routes/reportRoutes");
const dashboardRoutes = require("./src/routes/dashboardRoutes");
const cmsRoutes = require("./src/routes/cmsRoutes");

const app = express();

// Necessário para obter o IP real do cliente quando atrás de reverse proxy (ex: Vercel, Nginx).
app.set("trust proxy", 1);

// --- Middlewares globais ---

// Origens permitidas para pedidos CORS (frontend em produção e em desenvolvimento local).
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173'
];

app.use(cors({
  origin: function (origin, callback) {
    // Permite pedidos sem origem (ex: ferramentas como Postman) ou origens na lista.
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Bloqueado pelo CORS'));
    }
  },
  // Permite envio de cookies e cabeçalhos de autenticação entre origens.
  credentials: true
}));

// Limite de 50 MB para suportar uploads de ficheiros via JSON (ex: base64).
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// --- Registo de rotas da API ---

// Serve ficheiros estáticos carregados (documentos, imagens, etc.).
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/permissions', permissionRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/documents', documentRoutes);

// Rotas de pastas globais — registadas diretamente aqui por não pertencerem ao router de documentos.
const documentController = require('./src/controllers/documentController');
const authMiddleware = require('./src/middlewares/authMiddleware');
const checkPermission = require('./src/middlewares/permissionMiddleware');

app.post('/api/global-folders', authMiddleware, checkPermission('CREATE_DOCUMENT'), documentController.createFolder);

app.delete('/api/global-folders/:id', authMiddleware, checkPermission('DELETE_DOCUMENT'), documentController.deleteFolder);

app.use('/api/tickets', ticketRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/audit-logs', auditLogRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/cms', cmsRoutes);

// --- Rota de teste ---
app.get("/", (req, res) => {
  res.json({ message: "Bem-vindo à API da ProjectBox!" });
});

// --- Inicialização da base de dados e do servidor ---
const PORT = process.env.PORT || 5000;

// Sincroniza os modelos com a BD (alter: true aplica alterações de esquema sem apagar dados).
db.sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("✅ DB synchronized successfully!");
    app.listen(PORT, () => {
      console.log(`🚀 Server running: ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Fatal Error:", error);
  });
